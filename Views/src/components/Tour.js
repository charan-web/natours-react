import React, { useState, useEffect, useCallback } from "react";
import Map from "./Map";
import { useParams } from "react-router-dom";
// import axios from 'axios';
import Error from "./Error";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { callTheUser } from "./reduser/userAction";

const Tour = React.memo(({ user, callUser }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const tourName = useParams();


  const url = `https://infinite-spire-90765.herokuapp.com/tour/${tourName.id}`;
  
  const getTour = useCallback(async () => {
    try {
      const data = await fetch(url);
      const res = await data.json();
      
      setData(res);
      setLoading(false);
    } catch (error) {
      console.log(error);

    
    }
  }, [url]);

  useEffect(() => {
    if(localStorage.getItem('jwt')){
      callUser()
    }
    
    getTour();
  }, [url, getTour, callUser]);

  let tour = data?.data?.tour;
  
  if (data.status === "error") {
    return <Error value="There is No Tour with that Name" />;
  } else {
    return (
      <>
        {loading ? (
          "loading"
        ) : (
          <>
            {/* Title Card */}

            <section className="section-header">
              <div className="heading-box">
                <h1 className="heading-primary">
                  <span>
                    {tour.name}
                    <br />
                    Tour
                  </span>
                </h1>
                {/* Details About Tour  */}
                <div className="heading-box__group">
                  <div className="heading-box__detail">
                    <svg className="heading-box__icon">
                      <use href="/img/icons.svg#icon-clock"></use>
                    </svg>
                    <span className="heading-box__text">
                      {tour.duration} days
                    </span>
                  </div>
                  <div className="heading-box__detail">
                    <svg className="heading-box__icon">
                      <use href="/img/icons.svg#icon-map-pin"></use>
                    </svg>
                    <span className="heading-box__text">
                      {tour.startLocation.description}
                    </span>
                  </div>
                </div>
              </div>
            </section>
            {/* Tour description */}
            <section className="section-description">
              <div className="overview-box">
                <div>
                  <div className="overview-box__group">
                    <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-calendar"></use>
                      </svg>
                      <span className="overview-box__label">Next date</span>
                      <span className="overview-box__text">
                        {tour.startDates[0]}
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-trending-up"></use>
                      </svg>
                      <span className="overview-box__label">Difficulty</span>
                      <span className="overview-box__text">
                        {tour.difficulty}
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-user"></use>
                      </svg>
                      <span className="overview-box__label">Participants</span>
                      <span className="overview-box__text">
                        {tour.maxGroupSize} people
                      </span>
                    </div>
                    <div className="overview-box__detail">
                      <svg className="overview-box__icon">
                        <use href="/img/icons.svg#icon-star"></use>
                      </svg>
                      <span className="overview-box__label">Rating</span>
                      <span className="overview-box__text">
                        {tour.ratingAverage} / {tour.ratingsQuantity}
                      </span>
                    </div>
                  </div>
                  {/* Tour Guides */}
                  <div className="overview-box__group">
                    <h2 className="heading-secondary ma-bt-lg">
                      Your tour guides
                    </h2>

                    {tour.guides.map((guide) => {
                      return (
                        <div key={guide.name} className="overview-box__detail">
                          <img
                            src={`/img/users/${guide.photo}`}
                            alt="Lead guide"
                            className="overview-box__img"
                          />
                          <span className="overview-box__label">
                            {guide.role}
                          </span>
                          <span className="overview-box__text">
                            {guide.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="description-box">
                <h2 className="heading-secondary ma-bt-lg">
                  About the {tour.name} Tour
                </h2>
                <p className="description__text">{tour.description}</p>
              </div>
            </section>

            <section className="section-pictures">
              {tour.images.map((image) => {
                return (
                  <div key={image} className="picture-box">
                    <img
                      className="picture-box__img picture-box__img--1"
                      src={`/img/tours/${image}`}
                      alt="The Park Camper Tour 1"
                    />
                  </div>
                );
              })}
            </section>
            {/* Map  */}
            <Map tour={tour} />
            {/* Review Section */}
            <section className="section-reviews">
              <div className="reviews">
                {tour.reviews.map((rev) => {
                  return (
                    <div key={rev.id} className="reviews__card">
                      <div className="reviews__avatar">
                        <img
                          src={`/img/users/${rev.user.photo}`}
                          alt="Jim Brown"
                          className="reviews__avatar-img"
                        />
                        <h6 className="reviews__user">{rev.user.name}</h6>
                      </div>
                      <p className="reviews__text">{rev.review}</p>
                      <div className="reviews__rating">
                        {[1, 2, 3, 4, 5].map((star) => {
                          return (
                            <svg
                              key={star}
                              className={`reviews__star reviews__star--${
                                rev.rating >= star ? "active" : "inactive"
                              }`}
                            >
                              <use href="/img/icons.svg#icon-star"></use>
                            </svg>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="section-cta">
              <div className="cta">
                <div className="cta__img cta__img--logo">
                  <img
                    src="/img/logo-white.png"
                    alt="Natours logo"
                    className=""
                  />
                </div>
                <img
                  src={`/img/tours/${tour.images[2]}`}
                  alt=""
                  className="cta__img cta__img--1"
                />
                <img
                  src={`/img/tours/${tour.images[0]}`}
                  alt=""
                  className="cta__img cta__img--2"
                />

                <div className="cta__content">
                  <h2 className="heading-secondary">
                    What are you waiting for?
                  </h2>
                  <p className="cta__text">
                    {tour.duration} days. 1 adventure. Infinite memories. Make
                    it yours today!
                  </p>
                  {user.isLoggedIn ? (    
                    <Link
                      to={`/booking/${tour.id}`}
                      className="btn btn--green span-all-rows"
                    >
                      Book tour now!
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn--green span-all-rows">
                      Login to Book Tour
                    </Link>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    tour: state.tour,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    callUser: () => dispatch(callTheUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tour);
