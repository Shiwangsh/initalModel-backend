const Route = require("../models/route_model");
const catchAsync = require("../utils/catchAsync");
const factoryController = require("./factoryController");

exports.getAllRoutes = factoryController.getAll(Route);

exports.getSpecificRoute = catchAsync(async (req, res) => {
  const { startStop, endStop } = req.body;
  // let userRoute1 = [];
  // let userRoute2 = [];
  let userStops = [];
  let stopsCheck = [];
  let userStopsNumber = [];

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
    const userStops = stopsForSingleRoute(userRoute, startStop, endStop);
    console.log("USERSTOPS=", userStops);
    res.status(201).json({
      status: "success",
      data: userRoute.length,
      userRoute,
    });
  } else {
    let userRoute = [];
    const route1 = await Route.findOne({
      stops: { $elemMatch: { name: startStop } },
    });
    console.log(">>>>ROUTE1>>>>>", route1);

    const route2 = await Route.findOne({
      stops: { $elemMatch: { name: endStop } },
    });
    console.log(">>>>>ROUTE2>>>>>>", route2);

    userRoute.push(route1, route2);

    console.log("User route=", userRoute);
    // console.log("User stops=", userStops);

    const userStops = stopsForDoubleRoute(route1, route2, startStop, endStop);
    // console.log("ASHDAKSDKJASD>>>>", userStops);
    res.status(201).json({
      status: "success",
      result: userRoute.length,
      userStops,
      userRoute,
    });
  }
});

// Find users path of direction

const stopsForSingleRoute = (userRoute, startStop, endStop) => {
  console.log(startStop, endStop);
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

  if (initialStopNumber < finalStopNumber) return requiredStops;
  return requiredStops.reverse();
};

const stopsForDoubleRoute = (route1, route2, startStop, endStop) => {
  let initialRouteStopNumbers = [];
  let secondRouteStopNumbers = [];
  let userStops = [];

  const joiningStops = route1.stops.filter((stop) => {
    return route2.stops.some((stop2) => {
      return stop.name === stop2.name;
    });
  });

  if (startStop >= joiningStops[0].number) {
    const dropStop = joiningStops[0];
  }
  joiningStops.reverse();
  const dropStop = joiningStops[0];

  console.log("JOINING STOPS>>>>", joiningStops);
  console.log("DROP STOP>>>>", dropStop);

  (() => {
    for (let i = 0; i < route1.stops.length; i++) {
      if (route1.stops[i].name === startStop) {
        // initialStopNumber = route1.stops[i].number;
        initialRouteStopNumbers.unshift(route1.stops[i].number);
        console.log(initialRouteStopNumbers[0], "@>>>", startStop);
      }
      if (route1.stops[i].name === dropStop.name) {
        initialRouteStopNumbers.push(route1.stops[i].number);
        console.log(initialRouteStopNumbers[1], "@>>>", dropStop.name);
      }
    }
    for (let i = 0; i < route2.stops.length; i++) {
      if (route2.stops[i].name === endStop) {
        // finalStopNumber = route2.stops[i].number;
        secondRouteStopNumbers.unshift(route2.stops[i].number);
        console.log(secondRouteStopNumbers[0], "@>>>", endStop);
      }
      if (route2.stops[i].name === dropStop.name) {
        secondRouteStopNumbers.push(route2.stops[i].number);
        console.log(secondRouteStopNumbers[1], "@>>>", dropStop.name);
      }
    }
    return initialRouteStopNumbers, secondRouteStopNumbers;
  })();

  console.log(initialRouteStopNumbers, secondRouteStopNumbers);

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
  // reverse if firt stop greater (change direction)
  if (initialRouteStopNumbers[0] > initialRouteStopNumbers[1])
    userStopsForRoute1.reverse();
  if (secondRouteStopNumbers[0] < secondRouteStopNumbers[1])
    userStopsForRoute2.reverse();

  // console.log("DROP STOP>>>>", userStopsForRoute1, userStopsForRoute2);
  userStops.push(userStopsForRoute1, userStopsForRoute2);
  console.log(userStops);
  return userStops;
  // return userStopsForRoute1, userStopsForRoute2;
};

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
