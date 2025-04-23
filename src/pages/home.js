export function renderHome () {
  let homeContainer = document.createElement('div');
  homeContainer.classList.add('home-container');

  /* 
    Hero Image
  */
  let heroImageContainer = document.createElement('div');
  heroImageContainer.classList.add("hero-image-container");

  let heroImage = document.createElement('img');
  heroImage.classList.add('hero-image');

  import('../assets/img/hero-image-day.jpg').then( result => {
    heroImage.src = result.default;
    console.log(result.default);
  });

  let imgAttribution = document.createElement('div');
  imgAttribution.classList.add('img-attribution');
  imgAttribution.innerHTML = `
      Photo by
      <a
        href="https://unsplash.com/@kimheesu?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
        >heesu kim</a
      >
      on
      <a
        href="https://unsplash.com/photos/a-lone-cloud-in-a-blue-sky-d7Dpep8WDBM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
        >Unsplash</a
      >
    `;

  heroImageContainer.appendChild(heroImage);
  heroImageContainer.appendChild(imgAttribution);

  /* 
    Home main section 
  */
  let homeMainSection = document.createElement('div');
  homeMainSection.classList.add("home-main")

  let homeForm = document.createElement('form');
  homeForm.id = 'home-form';

  let logoContainer = document.createElement('div');
  logoContainer.classList.add('logo-container');

  let logo = document.createElement('div');
  logo.classList.add('logo');
  logo.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2c3.292 0 6 2.435 6 5.5c0 1.337-.515 2.554-1.369 3.5H21a1 1 0 0 1 1 1c0 3.292-2.435 6-5.5 6c-1.336 0-2.553-.515-3.5-1.368V21a1 1 0 0 1-1 1c-3.292 0-6-2.435-6-5.5c0-1.336.515-2.553 1.368-3.5H3a1 1 0 0 1-1-1c0-3.292 2.435-6 5.5-6c1.337 0 2.554.515 3.5 1.369V3a1 1 0 0 1 1-1"
        />
      </svg>
    `;

  let siteName = document.createElement('div');
  siteName.classList.add('site-name');
  siteName.textContent = 'TroposFront';

  logoContainer.appendChild(logo);
  logoContainer.appendChild(siteName);

  let findLocationBtn = document.createElement('button');
  findLocationBtn.classList.add('find-location');
  findLocationBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m15.94 7.62l-4.88 2a2.63 2.63 0 0 0-1.48 1.48l-2 4.88a.34.34 0 0 0 .19.44a.36.36 0 0 0 .25 0l4.88-2a2.63 2.63 0 0 0 1.48-1.48l2-4.88a.34.34 0 0 0-.19-.44a.36.36 0 0 0-.25 0M12 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
        />
        <path
          fill="currentColor"
          d="M12 21a9 9 0 1 1 9-9a9 9 0 0 1-9 9m0-16.5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 4.5"
        />
      </svg>
    `;

  let searchLocationInput = document.createElement('input');
  searchLocationInput.type = 'text';
  searchLocationInput.classList.add('search-location');
  searchLocationInput.placeholder = 'Search Location...';

  homeForm.appendChild(logoContainer);
  homeForm.appendChild(findLocationBtn);
  homeForm.appendChild(searchLocationInput);

  let creditSection = document.createElement('div');
  creditSection.classList.add('credit-section');

  let developer = document.createElement('div');
  developer.classList.add('developer');
  developer.innerHTML = `
      &copy; 2025 - Designed and Developed by
      <a href="https://github.com/JohnKelly-T">
        John Kelly
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            color="currentColor"
          >
            <path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568" />
            <path
              d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22"
            />
          </g>
        </svg>
      </a>
    `;


  let apiAttribution = document.createElement('div');
  apiAttribution.classList.add('api');
  apiAttribution.innerHTML = `
     Powered by
      <a href="https://www.weatherapi.com/" title="Free Weather API"
        >WeatherAPI.com</a
      >
    `;

  creditSection.appendChild(developer);
  creditSection.appendChild(apiAttribution);

  homeMainSection.appendChild(homeForm);
  homeMainSection.appendChild(creditSection);

  homeContainer.appendChild(heroImageContainer);
  homeContainer.appendChild(homeMainSection);

  return homeContainer;
}