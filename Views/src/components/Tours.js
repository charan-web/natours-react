import React, { useEffect } from 'react';
import axios from "axios"
// import Tour from "./Tour"
// import img from "./../img/tours/tour-2-cover.jpg"
import { callTheTour } from './reduser/toureducer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Tours = ({call,tour,user}) => {  
  useEffect(() => {
  
   call()
   
  
  }, [call]);
            
  return (
    <main className="main">
      {tour.loading ? (
        'loading'
      ) : (
        <div className="card-container">
          {tour.data?.map((data) => {
            return (
              <div className="card" key={data.id}>
                <div className="card__header">
                  <div className="card__picture">
                    <div className="card__picture-overlay">&nbsp;</div>
                    <img
                      // src={'img/pin.png'}
                      src={`/img/tours/${data.imageCover}`}
                      alt={data.name}
                      className="card__picture-img"
                    />
                  </div>

                  <h3 className="heading-tertirary">
                    <span>{data.name}</span>
                  </h3>
                </div>

                <div className="card__details">
                  <h4 className="card__sub-heading">
                    {data.difficulty + ' ' + data.duration + ' day tour'}
                  </h4>
                  <p className="card__text">{data.summary}</p>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use href="/img/icons.svg/icon-map-pin"></use>
                    </svg>
                    <span>{data.startLocation.description}</span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use href="/img/icons.svg/icon-calendar"></use>
                    </svg>
                    <span>
                      {new Date(data.startDates[0]).toLocaleString('en-us', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use href="/img/icons.svg/icon-flag"></use>
                    </svg>
                    <span> {data.locations.length + ' stops'}</span>
                  </div>
                  <div className="card__data">
                    <svg className="card__icon">
                      <use href="/img/icons.svg/icon-user"></use>
                    </svg>
                    <span>{data.maxGroupSize + ' people'}</span>
                  </div>
                </div>

                <div className="card__footer">
                  <p>
                    <span className="card__footer-value">
                      {'$' + data.price}
                    </span>
                    <span className="card__footer-text"> per person</span>
                  </p>
                  <p className="card__ratings">
                    <span className="card__footer-value">
                      {data.ratingAverage}
                    </span>
                    <span className="card__footer-text">
                      {'rating ' + data.ratingsQuantity}
                    </span>
                  </p>

                  <Link
                    to={`/tour/${data.name}`}
                    className="btn btn--green btn--small"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};                

              

    
 

const mapStateToProps = (state) => {

  return { 
    tour : state.tour,
    user: state.user
    } 
}

const mapDispatchToProps = (dispatch) => {
  return {
    call : ()=>dispatch(callTheTour())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Tours);
