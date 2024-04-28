<template>
    <div class="page-content">

        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <img class="profile-img" src="../assets/images/briefcase1.png" alt="Profile Picture">
              <h2 class="mt-3 text-center">{{ fullName }}</h2>
              <p class="text-muted text-center">Développeur</p>
            </div>
            <div class="col-md-8">
                <div class="card mb-3">
                <div class="card-header">
                  <h3>Description</h3>
                </div>
                <p class="text-muted">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo placeat obcaecati et in maiores rerum cum officiis quod ex. Labore eligendi provident similique non! Delectus dignissimos dolor consequatur cumque tempora.</p>
              </div>
              <div class="card mb-3">
                <div class="card-header">
                  <h3>Professional Experience</h3>
                </div>
                <ul class="list-group list-group-flush" v-for="experience in experiences" :key="experience.id">
                  <li class="list-group-item">
                    <h5>{{ experience.company }} - {{ experience.title }}</h5>
                    <p class="mb-0">{{ experience.startDate }} - {{ experience.endDate }}</p>
                    <p class="text-muted">{{ experience.description }}</p>
                  </li>
                </ul>
              </div>
              <div class="card">
                <div class="card-header">
                  <h3>Formations</h3>
                </div>
                <ul class="list-group list-group-flush" v-for="formation in formations" :key="formation.id">
                  <li class="list-group-item">
                    <h5>{{ formation.institution }} - {{ formation.degree }}</h5>
                    <p class="mb-0">{{ formation.startDate }} - {{ formation.endDate }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        fullName: "John Doe",
        shortDescription: "Highly motivated and results-oriented professional",
        experiences: [
          {
            id: 1,
            company: "Example Company",
            title: "Software Engineer",
            startDate: "2020-01-01",
            endDate: "2023-12-31",
            description: "Developed and maintained web applications using modern technologies."
          },
          // Add more experiences here
        ],
        formations: [
          {
            id: 1,
            institution: "University of Example",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2016-09-01",
            endDate: "2020-05-31"
          },
          // Add more formations here
        ]
      };
    }
  };
  </script>
  <style scoped>
  /* Container */
  .container {
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #f0f2f5; /* Light background */
  }

  .row {
    width: 100%;
  }
  
  /* Columns */
  .col {
    flex: 0 0 50%;
    padding: 15px;
    background-color: #fff; /* White background for content */
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    margin-bottom: 20px;
  }
  
  /* Profile Picture */
  .profile-picture {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    border: 5px solid #e91e63; /* Pink border */
  }
  
  /* Cards */
  .card {
    padding: 21px;
    border-radius: 5px;
    background-color: #f5f5f5; /* Light gray background */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* More prominent shadow */
  }
  
  .card-header {
    border-bottom: 1px solid #e91e63; /* Pink border */
    padding-bottom: 10px;
    margin-bottom: 10px;
    color: #333; /* Darker text for better contrast */
  }

  .profile-img {
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  
  /* Button */
  .btn {
    padding: 10px 20px;
    background-color: #e91e63; /* Pink button */
    color: #fff; /* White text */
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #c2185b; /* Darker pink on hover */
  }
  
  /* Text Alignment */
  .text-center {
    text-align: center;
  }
  
  /* Titles and Headings */
  h2, h3, h5 {
    color: #333; /* Darker text for better contrast */
  }
  
  /* Description and Text */
  p {
    color: #666; /* Lighter text for readability */
  }
  
  /* Responsiveness (Optional) */
  @media (max-width: 768px) {
    .col {
      flex: 100%; /* Stack columns on smaller screens */
    }
  }
  </style>