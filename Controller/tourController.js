const Tour = require("./../Models/tourModel");
const ApiFeatures = require("./../Utilities/APIfeatures");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAllTours = async (req, res, next) => {
 
  let features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .page();
   
  const tours = await features.query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
}  ;

exports.getTour = catchAsync(async (req, res, next) => {
  const tourToFind = req.params.id;

  // const tour = await Tour.findById(tourToFind).populate('reviews')
  const tour = await Tour.findOne({name:req.params.id}).populate('reviews')

  if (!tour) {
    return "no tour";
  }

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {

  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      tour: updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
  });
});

exports.topCheapTours = catchAsync((req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
});

exports.geoWithIn = async (req,res,next)=>{
  const { distance,latlng,unit} = req.params

  const [lat,,lng] = latlng.split(',')

  const radius = unit==="mi" ? distance / 3963.2 : distance / 6378.1

  const tours = await Tour.find({
    startLocation:{ $geoWithin:{$centerSphere:[ [lat,lng],radius]}}
  })

  res.status(200).json({
    status:"success",
    results:tours.length,
    data:{
      tours
    }

  })
}
