const Route = require("../models/route_model");
const Bus = require("../models/bus_model");

const catchAsync = require("../utils/catchAsync");
const factoryController = require("./factoryController");

const calculateFair = (userStops) => {
  const totalDistance = userStops
    .map((item) => item.distance)
    .reduce((prev, curr) => prev + curr, 0);
  // console.log(totalDistance);
  let amount = (totalDistance / 1000) * process.env.STD_FARE_PER_KM;
  return amount;
};

exports.getSpecificRoute = catchAsync(async (req, res) => {
  const { startStop, endStop } = req.body;

  const findSingleRoute = await Route.aggregate([
    // Filter possible documents
    { $match: { "stops.name": startStop } },

    // Match specific array elements
    { $match: { "stops.name": endStop } },

    // Group back to array form
    {
      $group: {
        _id: "$_id",
        routeName: { $first: "$routeName" },
        stops: { $first: "$stops" },
      },
    },
  ]);

  if (findSingleRoute.length === 1) {
    const userRoute = findSingleRoute;
    const stopsAndBuses = await stopsAndBusesForSingleRoute(
      userRoute,
      startStop,
      endStop
    );
    const userFair = calculateFair(stopsAndBuses[0]).toFixed(2);

    res.status(201).json({
      status: "success",
      userFair,
      result: userRoute.length,
      userStops: stopsAndBuses[0],
      buses: stopsAndBuses[1],
      userRoute,
    });
  } else if (findSingleRoute.length === 2) {
    (ranNum = () => {
      let random = Math.random();

      // If the random number is less than 0.5, return 0
      if (random < 0.5) {
        // return 0;
        return (ranNum = 0);
      }
      // Otherwise, return 1
      else {
        // return 1;
        return (ranNum = 1);
      }
    })();
    // Selects one of the route on random (**Return less trafic route in future**)
    const userRoute = [findSingleRoute[0]];
    const stopsAndBuses = await stopsAndBusesForSingleRoute(
      userRoute,
      startStop,
      endStop
    );
    const userFair = calculateFair(stopsAndBuses[0]).toFixed(2);

    res.status(201).json({
      status: "success",
      result: userRoute.length,
      userFair,
      userStops: stopsAndBuses[0],
      buses: stopsAndBuses[1],
      userRoute,
    });
  } else {
    let userRoute = [];
    const route1 = await Route.findOne({
      stops: { $elemMatch: { name: startStop } },
    });
    // console.log(">>>>ROUTE1>>>>>", route1);

    const route2 = await Route.findOne({
      stops: { $elemMatch: { name: endStop } },
    });
    // console.log(">>>>>ROUTE2>>>>>>", route2);

    userRoute.push(route1, route2);

    // console.log("User route=", userRoute);

    const userStopsAndBuses = await stopsandBusesForDoubleRoute(
      route1,
      route2,
      startStop,
      endStop
    );
    // console.log(">>>>>>>>>>>>>", userStopsAndBuses[0][0]);
    const userFairOne = calculateFair(userStopsAndBuses[0][0]);
    const userFairTwo = calculateFair(userStopsAndBuses[0][1]);

    const userFairTotal = (userFairOne + userFairTwo).toFixed(2);

    res.status(201).json({
      status: "success",
      result: userRoute.length,
      userFair: userFairTotal,
      userStops: userStopsAndBuses[0],
      buses: userStopsAndBuses[1],
      userRoute,
    });
  }
});
const getBuses = async (routeID, direction) => {
  /*
   *Query Buses based on the route
   *Send buses with only relative to user's path or direction
   */
  const buses = await Bus.find({ route: routeID, direction: direction }).select(
    "latitude longitude regNum direction"
  );
  return buses;
};

// Find users stops and path of direction

const stopsAndBusesForSingleRoute = async (userRoute, startStop, endStop) => {
  let initialStopNumber, finalStopNumber;
  (() => {
    for (let i = 0; i < userRoute[0].stops.length; i++) {
      if (userRoute[0].stops[i].name === startStop) {
        initialStopNumber = userRoute[0].stops[i].number;
        console.log(initialStopNumber, "@>>>", startStop);
      }
      if (userRoute[0].stops[i].name === endStop) {
        finalStopNumber = userRoute[0].stops[i].number;
        console.log(finalStopNumber, "@>>>", endStop);
      }
    }
    return initialStopNumber, finalStopNumber;
  })();
  const requiredStops = userRoute[0].stops.filter(function (stop) {
    if (initialStopNumber < finalStopNumber) {
      return stop.number >= initialStopNumber && stop.number <= finalStopNumber;
    }
    return stop.number <= initialStopNumber && stop.number >= finalStopNumber;
  });
  // Return stops respective to passenger's direction
  if (initialStopNumber < finalStopNumber) {
    const buses = await getBuses(userRoute[0]._id, "UpDown");
    return [requiredStops, buses];
  } else {
    const buses = await getBuses(userRoute[0]._id, "DownUp");

    return [requiredStops.reverse(), buses];
  }
};

const stopsandBusesForDoubleRoute = async (
  route1,
  route2,
  startStop,
  endStop
) => {
  let initialRouteStopNumbers = [];
  let secondRouteStopNumbers = [];
  let userStops = [];
  let buses = [];
  let dropStop;

  (() => {
    for (let i = 0; i < route1.stops.length; i++) {
      if (route1.stops[i].name === startStop) {
        initialRouteStopNumbers.unshift(route1.stops[i].number);
        console.log(initialRouteStopNumbers, "@#>>>", startStop);
      }
    }
    for (let i = 0; i < route2.stops.length; i++) {
      if (route2.stops[i].name === endStop) {
        secondRouteStopNumbers.push(route2.stops[i].number);
        console.log(secondRouteStopNumbers, "@#>>>", endStop);
      }
    }
    return initialRouteStopNumbers, secondRouteStopNumbers;
  })();

  // The joining (common) stops in both routes
  const joiningStops = route1.stops.filter((stop) => {
    return route2.stops.some((stop2) => {
      return stop.name === stop2.name;
    });
  });
  // Drop stop based on the user's direction
  if (initialRouteStopNumbers[0] >= joiningStops[0].number) {
    joiningStops.reverse();
    dropStop = joiningStops[0];
  } else {
    dropStop = joiningStops[0];
  }

  console.log("JOINING STOPS>>>>", joiningStops);
  console.log("DROP STOP>>>>", dropStop);

  // Stops travelled by user in both routes (startStop->>dropStop / dropStop->>endStop)
  (() => {
    for (let i = 0; i < route1.stops.length; i++) {
      if (route1.stops[i].name === dropStop.name) {
        initialRouteStopNumbers.push(route1.stops[i].number);
        console.log(initialRouteStopNumbers[1], "@>>>", dropStop.name);
      }
    }
    for (let i = 0; i < route2.stops.length; i++) {
      if (route2.stops[i].name === dropStop.name) {
        secondRouteStopNumbers.unshift(route2.stops[i].number);
        console.log(secondRouteStopNumbers[1], "@>>>", dropStop.name);
      }
    }
    return initialRouteStopNumbers, secondRouteStopNumbers;
  })();

  console.log(initialRouteStopNumbers, secondRouteStopNumbers);

  // Returns stops for first route based on the user's direction
  const userStopsForRoute1 = route1.stops.filter(function (stop) {
    if (initialRouteStopNumbers[0] < initialRouteStopNumbers[1]) {
      return (
        stop.number >= initialRouteStopNumbers[0] &&
        stop.number <= initialRouteStopNumbers[1]
      );
    }
    return (
      stop.number <= initialRouteStopNumbers[0] &&
      stop.number >= initialRouteStopNumbers[1]
    );
  });

  // Returns stops for second route based on the user's stops
  const userStopsForRoute2 = route2.stops.filter(function (stop) {
    if (secondRouteStopNumbers[0] < secondRouteStopNumbers[1]) {
      return (
        stop.number >= secondRouteStopNumbers[0] &&
        stop.number <= secondRouteStopNumbers[1]
      );
    }
    return (
      stop.number <= secondRouteStopNumbers[0] &&
      stop.number >= secondRouteStopNumbers[1]
    );
  });
  // reverse if first stop greater (change direction)
  if (initialRouteStopNumbers[0] > initialRouteStopNumbers[1]) {
    userStopsForRoute1.reverse();
    buses.unshift(await getBuses(route1._id, "DownUp"));
  } else {
    buses.unshift(await getBuses(route1._id, "UpDown"));
  }
  if (secondRouteStopNumbers[0] > secondRouteStopNumbers[1]) {
    userStopsForRoute2.reverse();
    buses.unshift(await getBuses(route2._id, "DownUp"));
  } else {
    buses.unshift(await getBuses(route2._id, "UpDown"));
  }

  userStops.push(userStopsForRoute1, userStopsForRoute2);
  console.log(userStops);
  return [userStops, buses];
};

//  const lat1 = 27.696735657019087;
//  const lon1 = 85.21471489219488;
//  const lat2 = 27.69536470988985;
//  const lon2 = 85.35493860552134;

//  var distance = calculateDistance(lat1, lon1, lat2, lon2);
//  console.log(distance);

// !!!!!
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   // convert latitudes and longitudes to radians
//   lat1 = (lat1 * Math.PI) / 180;
//   lon1 = (lon1 * Math.PI) / 180;
//   lat2 = (lat2 * Math.PI) / 180;
//   lon2 = (lon2 * Math.PI) / 180;

//   // calculate the differences in latitude and longitude
//   var deltaLat = lat2 - lat1;
//   var deltaLon = lon2 - lon1;

//   // use the Haversine formula to calculate the distance
//   var a =
//     Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//     Math.cos(lat1) *
//       Math.cos(lat2) *
//       Math.sin(deltaLon / 2) *
//       Math.sin(deltaLon / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = 6371 * c; // 6371 is the radius of the Earth in kilometers

//   return d;
// }

// !!----------------------------💀🪦🪦🪦💀--------------------------------------- !!//
// const routes = await Route.find();

//  loop1: for (let i = 0; i < routes.length; i++) {
//    loop2: for (let j = 0; j < routes[i].stops.length; j++) {
//      if (routes[i].stops[j].name === startStop) {
//        stopsCheck.unshift(startStop);
//        userRoute1.unshift(routes[i]);
//        userStopsNumber.unshift(routes[i].stops[j].number);
//        if (
//          JSON.stringify(stopsCheck) === JSON.stringify([startStop, startStop])
//        ) {
//          stopsCheck.pop(1);
//          break loop2;
//        }
//      }
//      if (routes[i].stops[j].name === endStop) {
//        stopsCheck.push(endStop);
//        userRoute2.push(routes[i]);
//        userStopsNumber.push(routes[i].stops[j].number);
//      }
//      console.log(stopsCheck);
//      console.log("STOPS NUMBER=", userStopsNumber);

//      if (JSON.stringify(stopsCheck) === JSON.stringify([startStop, endStop])) {
//        break loop1;
//      }
//      console.log("heyyy");
//    }
//  }

//  console.log("Userroute1 After loops", userRoute1);
//  console.log("Userroute2 After loops", userRoute2);

//  if (JSON.stringify(userRoute1) === JSON.stringify(userRoute2)) {
//    console.log("Congrats you made it");
//    userRoute1 = userRoute1.reduce((accumulator, value, index) => {
//      return { ...accumulator, [key + index]: value };
//    });
//    userRoute.push(userRoute1);
//    userStops = stopsForSingleRoute(
//      userRoute,
//      userStopsNumber,
//      startStop,
//      endStop
//    );
//  } else if (JSON.stringify(userRoute1[0]) === JSON.stringify(userRoute2[0])) {
//    console.log("Congrats you made it after the first");
//    userRoute2 = userRoute2.reduce((accumulator, value, index) => {
//      return { ...accumulator, [key + index]: value };
//    });
//    userRoute.push(userRoute2);
//    userStops = stopsForSingleRoute(
//      userRoute,
//      userStopsNumber,
//      startStop,
//      endStop
//    );
//  } else {
//    console.log("Congrats you made it here instead");

//    userRoute1 = userRoute1.reduce((accumulator, value, index) => {
//      return { ...accumulator, [key + index]: value };
//    });
//    userRoute2 = userRoute2.reduce((accumulator, value, index) => {
//      return { ...accumulator, [key + index]: value };
//    });
//    userRoute.push(userRoute1, userRoute2);
//    userStops = stopsForDoubleRoute(userRoute1, userRoute2);
//  }

// ----------------------------------------------------------------------

// exports.getSpecificRoute = catchAsync(async (req, res) => {
//   const { startStop, endStop } = req.body;
//   const findSingleRoute = await Route.aggregate([
//     // Filter possible documents
//     { $match: { "stops.name": startStop } },

//     // Match specific array elements
//     { $match: { "stops.name": endStop } },

//     // Group back to array form
//     {
//       $group: {
//         _id: "$_id",
//         routeName: { $first: "$routeName" },
//         stops: { $push: "$stops" },
//       },
//     },
//   ]);

//   if (findSingleRoute.length === 1) {
//     res.status(201).json({
//       status: "success",
//       data: findSingleRoute.length,
//       findSingleRoute,
//     });
//   }
//   const userRoute = await findDoubleRoute(startStop, endStop);

//   res.status(201).json({
//     status: "success",
//     data: userRoute.length,
//     userRoute,
//   });

//   const findDoubleRoute = async (startStop, endStop) => {
//     const firstRoute = await Route.aggregate([
//       // Filter possible documents
//       { $match: { "stops.name": startStop } },

//       // Match specific array elements
//       // Group back to array form
//       {
//         $group: {
//           _id: "$_id",
//           routeName: { $first: "$routeName" },
//           stops: { $push: "$stops" },
//         },
//       },
//     ]);

//     const secondRoute = await Route.aggregate([
//       // Filter possible documents
//       { $match: { "stops.name": endStop } },

//       // Match specific array elements
//       // Group back to array form
//       {
//         $group: {
//           _id: "$_id",
//           routeName: { $first: "$routeName" },
//           stops: { $push: "$stops" },
//         },
//       },
//     ]);
//     return firstRoute, secondRoute;
//   };
// });

// (() => {
//   routes.map((route) => {
//     if (
//       !(JSON.stringify(userStops) === JSON.stringify([startStop, endStop]))
//     ) {
//       route.stops.map((stop) => {
//         if (stop.name === startStop && !userStops.includes(startStop)) {
//           userStops.unshift(startStop);
//           userRoute1.push(route);
//         }
//         route.stops.map((stop) => {
//           if (stop.name === startStop && !userStops.includes(startStop)) {
//             userStops.unshift(startStop);
//             userRoute1.push(route);
//           }
//         });
//       });
//       route.stops.map((stop) => {
//         if (stop.name === endStop && !userStops.includes(endStop)) {
//           userStops.push(endStop);
//           userRoute2.push(route);
//         }
//       });
//     }
//     console.log(userStops);
//   });
// })();
