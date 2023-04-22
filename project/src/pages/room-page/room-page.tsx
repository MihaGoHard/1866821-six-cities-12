import LayoutBase from '../../layouts/layout-base/layout-base';
import { useParams, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const';
import RoomGallery from '../../components/room/room-gallery/room-gallery';
import { bringFirstCharToUpperCase } from '../../utils/common';
import Rating from '../../components/rating/rating';
import RoomFeatures from '../../components/room/room-features/room-features';
import RoomGoods from '../../components/room/room-goods/room-goods';
import RoomHost from '../../components/room/room-host/room-host';
import RoomReviews from '../../components/room/room-reviews/room-reviews';
import Map from '../../components/map/map';
import PlaceCardList from '../../components/place-card-list/place-card-list';
import { useEffect, useState } from 'react';
import { NO_CARD_ID } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/base';
import { checkAuthAction, fetchCommentsAction, fetchOfferAction, fetchOffersAction, } from '../../store/api-actions';
import { getOffer, getOfferLoadStatus, getOffers, getOffersLoadStatus } from '../../store/offers-process/offers-process.selectors';
import { getComments, getCommentsLoadStatus } from '../../store/commets-process/commets-process.selectors';
import { changeHotelId } from '../../store/aside-process/aside-process.slice';
import { getAuthorizationStatus } from '../../store/user-process/user-process.selectors';
import ErrorFullScreen from '../../components/error-fullscreen/error-fullscreen';
import Spinner from '../../components/spinners/spinner/spinner';


const OFFERS_LIST_LIMIT = 3;
const ScrollParameters: ScrollToOptions = {
  top: 0,
  behavior: 'smooth'
};

export default function RoomPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const idFromParams = Number(params.id);

  const offer = useAppSelector(getOffer);
  const offers = useAppSelector(getOffers);
  const offerLoadStatus = useAppSelector(getOfferLoadStatus);
  const offerStatus = useAppSelector(getOfferLoadStatus);
  const offersLoadStatus = useAppSelector(getOffersLoadStatus);
  const reviews = useAppSelector(getComments);
  const reviewsLoadStatus = useAppSelector(getCommentsLoadStatus);
  const authStatus = useAppSelector(getAuthorizationStatus);

  if (offerStatus.isError) {
    navigate(AppRoute.NotFound);
  }

  useEffect(() => {
    dispatch(fetchOfferAction(idFromParams));
    dispatch(fetchCommentsAction(idFromParams));
    dispatch(fetchOffersAction({offerId: idFromParams}));
    dispatch(changeHotelId(idFromParams));
    dispatch(checkAuthAction());
  }, [dispatch, idFromParams]);

  useEffect(() => {
    window.scrollTo(ScrollParameters);
    dispatch(changeHotelId(idFromParams));
  }, [idFromParams]);

  const [activeOfferId, setActiveOfferId] = useState(NO_CARD_ID);

  if(offerLoadStatus.isError) {
    return (
      <ErrorFullScreen />
    );
  }

  return (
    <div>
      {offer &&
      <LayoutBase withBaseHeader pageTitle="room">
        <main className="page__main page__main--property">
          <section className="property">
            <RoomGallery listOfImagesSrc={offer.images}/>
            <div className="property__container container">
              <div className="property__wrapper">
                {offer.isPremium &&
                <div className="property__mark">
                  <span>Premium</span>
                </div>}
                <div className="property__name-wrapper">
                  <h1 className="property__name">
                    {bringFirstCharToUpperCase(offer.title)}
                  </h1>
                  <button className="property__bookmark-button button" type="button">
                    <svg className="property__bookmark-icon" width="31" height="33">
                      <use xlinkHref="#icon-bookmark"></use>
                    </svg>
                    <span className="visually-hidden">To bookmarks</span>
                  </button>
                </div>
                <div className="property__rating rating">
                  <Rating rating={offer.rating} className='property__stars'/>
                  <span className="property__rating-value rating__value">{offer.rating}</span>
                </div>
                <RoomFeatures
                  offerType={offer.type}
                  bedroomsNumber={offer.bedrooms}
                  maxAdultsNumber={offer.maxAdults}
                />
                <div className="property__price">
                  <b className="property__price-value">&euro;{offer.price}</b>
                  <span className="property__price-text">&nbsp;night</span>
                </div>
                <RoomGoods goods={offer.goods}/>
                <RoomHost
                  name={offer.host.name}
                  isPro={offer.host.isPro}
                  avatarUrl={offer.host.avatarUrl}
                  description={offer.description}
                />
                {reviewsLoadStatus.isLoading && <Spinner />}
                {reviewsLoadStatus.isSuccess && <RoomReviews reviews={reviews} isAuthorized={authStatus.auth}/>}
                {reviewsLoadStatus.isError && <span>Ошибка загрузки отзывов</span>}
              </div>
            </div>
            <Map
              className='property__map'
              city={offer.city}
              offers={offers}
              selectedOfferId={activeOfferId}
              isWide
            />
          </section>
          <div className="container">
            {offersLoadStatus.isError && <Spinner />}
            {offersLoadStatus.isSuccess &&
            <section className="near-places places">
              <h2 className="near-places__title">Other places in the neighbourhood</h2>
              <div className="near-places__list places__list">
                <PlaceCardList
                  offers={offers.slice(0, OFFERS_LIST_LIMIT)}
                  type='nearPlaces'
                  classNamePrefix='near-places'
                  onListItemActive={setActiveOfferId}
                />
              </div>
            </section>}
            {offersLoadStatus.isError && <span>Ошибка загрузки предложений по аренде</span>}
          </div>
        </main>
      </LayoutBase>}
    </div>
  );
}
