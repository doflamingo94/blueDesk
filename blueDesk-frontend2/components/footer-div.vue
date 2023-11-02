<template>
    <footer class="container">
      <div class="footer-content">
        <div class="footer-col">
          <h3>Qui sommes nous ?</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet nisl euismod orci accumsan, ac blandit arcu pulvinar. </p>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><i class="fa fa-map-marker"></i> 123 rue des marais, 92345</li>
            <li><i class="fa fa-phone"></i>0956798520</li>
            <li><i class="fa fa-envelope"></i> info@example.com</li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Suivez nous</h3>
          <ul class="social-links">
            <li><a href="#"><i class="fa fa-facebook"></i></a></li>
            <li><a href="#"><i class="fa fa-twitter"></i></a></li>
            <li><a href="#"><i class="fa fa-instagram"></i></a></li>
            <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
          </ul>
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .container {
    margin-top: 70px;
    width: 100%;
    backdrop-filter: blur(15px);
    background-color: rgb(13 102 132);
    color: #fff;
    padding: 50px 0;
    font-family: 'Roboto', sans-serif;
    text-align: center;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-col {
    flex: 1;
    min-width: 300px;
    margin: 20px;
  }
  
  .footer-col h3 {
    margin-bottom: 20px;
  }
  
  .footer-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  
  .footer-col ul li {
    padding: 10px 0;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
  }
  
  .social-links li {
    margin: 0 10px;
  }
  
  .social-links a {
    color: #fff;
    font-size: 24px;
  }
  
  .social-links a:hover {
    color: #ccc;
  }
  
  .fa {
    display: inline-block;
    width: 20px;
    text-align: center;
  }
  
  .fa-facebook:before {
    content: '\f09a';
  }
  
  .fa-twitter:before {
    content: '\f099';
  }
  
  .fa-instagram:before {
    content: '\f16d';
  }
  
  .fa-linkedin:before {
    content: '\f0e1';
  }
  </style>
  