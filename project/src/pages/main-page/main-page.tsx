import Map from '../../components/map/map';
import PlaceCardList from '../../components/place-card-list/place-card-list';
import Sort from '../../components/sort/sort';
import LayoutBase from '../../layouts/layout-base/layout-base';
import { useState } from 'react';
import { NO_CARD_ID } from '../../const';
import CitiesList from '../../components/cities-list/cities-list';
import { useAppSelector } from '../../hooks/base';
import { Cities } from '../../const';
import { groupOffers } from '../../utils/favorites';
import { bringFirstCharToUpperCase } from '../../utils/common';


export default function MainPage() {
  const [activeOfferId, setActiveOfferId] = useState(NO_CARD_ID);

  const city = useAppSelector((state) => state.city);
  const offers = useAppSelector((state) => state.offersList);
  const offersOfCheckedCity = groupOffers(offers)[city.name];

  return (
    <LayoutBase
      withBaseHeader
      pageTitle='6 cities'
      className='page--gray page--main'
    >
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList
          cities={Object.values(Cities)}
          activeCity={city}
        />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offersOfCheckedCity ? offersOfCheckedCity.length : 'No'} places to stay in {bringFirstCharToUpperCase(city.name)}
              </b>
              {offersOfCheckedCity &&
                <><Sort />
                  <div className="cities__places-list places__list tabs__content">
                    <PlaceCardList
                      offers={offersOfCheckedCity}
                      onListItemActive={setActiveOfferId}
                      classNamePrefix='cities'
                      type='cities'
                    />
                  </div>
                </>}
            </section>
            <div className="cities__right-section">
              <Map
                className='cities__map'
                city={city}
                offers={offersOfCheckedCity}
                selectedOfferId={activeOfferId}
              />
            </div>
          </div>
        </div>
      </main>
    </LayoutBase>
  );
}
