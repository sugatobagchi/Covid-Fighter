$(document).ready(function () {

  $('#menu').click(function () {
    $(this).toggleClass('fa-times');
    $('.navbar').toggleClass('nav-toggle');
  });

  $(window).on('scroll load', function () {

    $('#menu').removeClass('fa-times');
    $('.navbar').removeClass('nav-toggle');

    if ($(window).scrollTop() > 0) {
      $('.scroll-top').show();
    } else {
      $('.scroll-top').hide();
    }

    $('section').each(function () {

      let height = $(this).height();
      let offset = $(this).offset().top - 200;
      let id = $(this).attr('id');
      let top = $(window).scrollTop();

      if (top > offset && top < offset + height) {
        $('.navbar ul li a').removeClass('active')
        $('.navbar').find(`[href="#${id}"]`).addClass('active');
      }

    });

  });

  $('a[href*="#"]').on('click', function (e) {

    e.preventDefault();

    $('html, body').animate({

      scrollTop: $($(this).attr('href')).offset().top,

    },
      500,
      'linear'
    )

  })

});

function getCoordinates() {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    let crd = pos.coords;
    let lat = crd.latitude.toString();
    let lng = crd.longitude.toString();
    let coordinates = [lat, lng];
    getCity(coordinates);
    return;

  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
  let xhr = new XMLHttpRequest();
  let lat = coordinates[0];
  let lng = coordinates[1];

  xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.820cc28083a4dcd7e2fa332ca5b9804b&lat=" + lat + "&lon=" + lng + "&format=json", true);
  xhr.send();
  xhr.onreadystatechange = processRequest;
  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      let city = sta[response.address.state];
      // console.log(city);
      getCases(city)
      return;
    }
  }
}

function getCases(city) {

  let a = new XMLHttpRequest();
  a.open('GET', "https://api.covid19tracker.in/data/static/timeseries.min.json", true);
  a.send();
  a.onreadystatechange = getStatus;
  function getStatus() {
    if (a.readyState == 4 && a.status == 200) {
      let r = JSON.parse(a.responseText);
      let b = r[city];
      b = b["dates"]
      let yourDate = new Date();
      let x = 2, D, del;
      // do {
      yourDate.setDate(yourDate.getDate() - x);
      yourDate = yourDate + "";
      D = yourDate.split(" ")
      del = b[formatDate(D[0] + " " + D[1] + " " + D[2] + " " + D[3])]
      text1 = del.delta;
      text2 = del.total;
      
      for (let key in text1) {
        if (key == "other")
          continue;
        let head = document.createElement("h1");
        head.innerHTML = key + " : " + text1[key];
        document.getElementsByClassName("unique1")[0].appendChild(head);
      }
      for (let key in text2) {
        if (key == "other")
          continue;
        let head = document.createElement("h1");
        head.innerHTML = key + " : " + text2[key];
        document.getElementsByClassName("unique2")[0].appendChild(head);
      }
    }
  }
}


function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}
getCoordinates();

let sta = {
  "Andaman and Nicobar Islands": "AN",
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chandigarh": "CG",
  "Chhattisgarh": "CH",
  "Dadra and Nagar Haveli": "DH",
  "Daman and Diu": "DD",
  "Delhi": "DL",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Lakshadweep": "LD",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OR",
  "Puducherry": "PY",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB"
}