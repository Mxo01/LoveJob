import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from 'src/app/Models/user.model';
import { Favorite } from 'src/app/Models/favorite.model';
import { Marker } from 'src/app/Models/marker.model';
import { DefaultService } from 'src/app/Services/default.service';
import { v4 as uuidv4 } from 'uuid';
import { APIService } from 'src/app/Services/api.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare let L: any;

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements AfterViewInit, OnInit {
  myLatLng: number[] = [0, 0];
  latLng: number[] = [0, 0];

  inMap: boolean = true;
  inFavorites: boolean = false;
  inChat: boolean = false;
  inProfile: boolean = false;

  onAddingMarker: boolean = false;

  companyName: string = '';
  name: string = '';
  position: string = '';
  salary: number = 0;
  city: string = '';
  state: string = '';

  currentID: string = '';
  currentMarker: any;
  isOwner: boolean = false;

  favorites: Favorite[] = [];

  currentUser: User | undefined;

  markerIconHome = L.icon({
    iconUrl: 'assets/markerIconHome.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  markerIconJob = L.icon({
    iconUrl: 'assets/markerIconJob.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  markerIcon = L.icon({
    iconUrl: 'assets/markerIcon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  markers: Marker[] = [];
  mapMarkers: any = {};
  jobMarkers: Favorite[] = [];
  currentJob: Favorite = {
    id: '',
    by: '',
    owner: '',
    companyName: '',
    name: '',
    position: '',
    salary: 0,
    city: '',
    state: ''
  };

  geoMarker: any;

  private map: any;

  getUserSubscription: Subscription = new Subscription();
  getMarkersSubscription: Subscription = new Subscription();
  getFavoritesSubscription: Subscription = new Subscription();

  private initMap(): void {
    this.map = L.map('map', {
      zoom: 5,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
    }).addTo(this.map);

    L.Control.geocoder({
      defaultMarkGeocode: false,
      title: 'Search by address, city, or zip code'
    }).on('markgeocode', (e: any) => {
      this.geoMarker = L.marker(e.geocode.center, {
        icon: this.markerIcon
      }).addTo(this.map).bindPopup(e.geocode.name).openPopup();
      this.map.setView(e.geocode.center, 16);
    }).addTo(this.map);
    document.querySelector('.leaflet-control-geocoder-icon')!.setAttribute('title', 'Search by address, city, or zip code');
    (document.querySelector('.leaflet-control-geocoder-form')!.firstChild! as HTMLInputElement).style.color = 'black';


    this.map.on('dragend', () => {
      this.latLng = this.map.getCenter();
      if (this.geoMarker) this.geoMarker.remove();
    });
  }

  constructor(private service: DefaultService, private apiService: APIService) {}

  ngOnInit(): void {
    this.getUserSubscription = this.apiService.getUser(this.service.getUsernameFromToken()).subscribe({
      next: (user: User) => {
        this.currentUser = user;
      }
    });

    this.getMarkersSubscription = this.apiService.getMarkers().subscribe({
      next: (markers: Marker[]) => {
        this.markers = markers;

        this.markers.forEach((marker) => {
          this.mapMarkers[marker.id] = L.marker([marker.lat, marker.lng], {
            title: marker.companyName + ', ' + marker.position,
            icon: this.markerIconJob
          }).addTo(this.map).on('click', () => {
            this.latLng = this.mapMarkers[marker.id].getLatLng();

            const modalTrigger = document.getElementById('jobModalTrigger');
            modalTrigger!.click();

            const newMarker: Favorite = {
              id: marker.id,
              by: marker.by,
              owner: '',
              companyName: marker.companyName,
              name: marker.name,
              position: marker.position,
              salary: marker.salary,
              city: marker.city,
              state: marker.state
            };

            this.jobMarkers.push(newMarker);

            this.currentID = marker.id;
            this.currentJob = newMarker;
            this.isOwner = this.currentJob.by === this.currentUser!.username;

            const newMarkerModal = document.getElementById('newMarker');
            newMarkerModal!.addEventListener('hidden.bs.modal', () => {
              this.companyName = '';
              this.name = '';
              this.position = '';
              this.salary = 0;
              this.city = '';
              this.state = '';
            });
          });
        });
      }
    });

    this.getFavoritesSubscription = this.apiService.getFavorites(this.service.getUsernameFromToken()).subscribe({
      next: (favorites: Favorite[]) => {
        this.favorites = favorites;
      }
    });

    const mapLink = document.getElementById('mapLink');
    mapLink!.classList.add('focus');

    const navLinks = document.querySelectorAll('.nav-link') as NodeListOf<HTMLButtonElement>;

    navLinks.forEach((navLink) => {
      navLink.addEventListener('click', () => {
        navLinks.forEach((nl) => {
          if (nl !== navLink) {
            nl.classList.remove('focus');
          }
        });
        navLink.classList.add('focus');
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.myLatLng = new L.LatLng(position.coords.latitude, position.coords.longitude);

        const youAreHerePopup = L.popup(this.myLatLng, {
          content: 'You are here',
          offset: L.point(0, -20)
        });

        this.map.panTo(this.myLatLng);

        L.marker(this.myLatLng, {
          alt: 'Your location',
          keepInView: true,
          riseOnHover: true,
          icon: this.markerIconHome
        }).addTo(this.map).on('click', () => {
          youAreHerePopup.openOn(this.map);
          this.map.setView(this.myLatLng, 16);
        });

        youAreHerePopup.openOn(this.map);

        this.map.setZoom(16);
      });
    }

    else {
      const geolocationModal = document.getElementById('geolocationSupport');
      const closeBtn = document.getElementById('closeBtn');
      const modalTrigger = document.getElementById('modalTrigger');
      modalTrigger!.click();

      geolocationModal!.addEventListener('shown.bs.modal', () => {
        closeBtn!.focus();
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe();
    this.getMarkersSubscription.unsubscribe();
    this.getFavoritesSubscription.unsubscribe();
  }

  onUpdateUser(user: User): void {
    this.currentUser = user;
    this.service.setFullName(user.firstName + ' ' + user.lastName);
  }

  addMarker(): void {
    this.onAddingMarker = true;
    this.map.addEventListener("click", (e: any) => {
      this.latLng = e.latlng;

      const newMakerTrigger = document.getElementById('newMarkerTrigger');
      newMakerTrigger!.click();
    });
  }

  deleteMarker(): void {
    Swal.fire({
      icon: 'info',
      title: 'Are you sure?',
      text: 'You will not be able to recover this marker!',
      background: '#212529',
      color: '#fff',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#bb2d3b',
      showCancelButton: true,
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'No, keep it',
      focusCancel: false
    }).then((result) => {
      if (result.isConfirmed) {
        const marker = this.mapMarkers[this.currentID];
        marker.remove();
        this.markers.filter((marker) => marker.id !== this.currentID);
        this.favorites = this.favorites.filter((fav) => fav.id !== this.currentID);
        this.apiService.deleteMarker(this.currentID).subscribe();
        this.apiService.deleteFavorite(this.currentID).subscribe();
      }
    });
  }

  setCompanyName(e: Event): void {
    this.companyName = (e.target as HTMLInputElement).value;
  }

  setName(e: Event): void {
    this.name = (e.target as HTMLInputElement).value;
  }

  setPosition(e: Event): void {
    this.position = (e.target as HTMLInputElement).value;
  }

  setSalary(e: Event): void {
    this.salary = +(e.target as HTMLInputElement).value;
  }

  setCity(e: Event): void {
    this.city = (e.target as HTMLInputElement).value;
  }

  setState(e: Event): void {
    this.state = (e.target as HTMLInputElement).value;
  }

  validateForm(): boolean {
    if (this.companyName === '' || this.name === '' || this.position === '' || this.city === '' || this.state === '')
      return false;

    return true;
  }

  exitFromAddPosition(): void {
    this.map.removeEventListener('click');
    this.onAddingMarker = false;
  }

  submitMarkerToMap(): void {
    const markerID = uuidv4();

    const marker: Marker = {
      id: markerID,
      by: this.currentUser!.username,
      lat: Object.values(this.latLng)[0],
      lng: Object.values(this.latLng)[1],
      name: this.name,
      companyName: this.companyName,
      position: this.position,
      salary: this.salary,
      city: this.city,
      state: this.state
    }

    this.currentMarker = L.marker(this.latLng, {
      title: this.companyName + ', ' + this.position,
      icon: this.markerIconJob
    }).addTo(this.map).on('click', () => {
      this.latLng = this.currentMarker.getLatLng();

      const modalTrigger = document.getElementById('jobModalTrigger');
      modalTrigger!.click();

      this.currentID = markerID;
      this.currentJob = this.jobMarkers.find((job) => job.id === this.currentID)!;
      this.isOwner = this.currentJob.by === this.currentUser!.username;
    });

    this.markers.push(marker);
    this.mapMarkers[markerID] = this.currentMarker;
    this.apiService.addMarker(marker).subscribe();

    const newMarker: Favorite = {
      id: markerID,
      by: this.currentUser!.username,
      owner: '',
      companyName: this.companyName,
      name: this.name,
      position: this.position,
      salary: this.salary,
      city: this.city,
      state: this.state
    };

    this.jobMarkers.push(newMarker);

    const newMarkerModal = document.getElementById('newMarker');
    newMarkerModal!.addEventListener('hidden.bs.modal', () => {
      this.companyName = '';
      this.name = '';
      this.position = '';
      this.salary = 0;
      this.city = '';
      this.state = '';
    });

    this.onAddingMarker = false;
    this.map.removeEventListener('click');
  }

  resetView(): void {
    this.map.setView(this.myLatLng, 16);
  }

  toMap(): void {
    this.inMap = true;
    this.inFavorites = false;
    this.inChat = false;
    this.inProfile = false;
  }

  toFavorites(): void {
    this.inFavorites = true;
    this.inMap = false;
    this.inChat = false;
    this.inProfile = false;
  }

  toChat(): void {
    this.inChat = true;
    this.inMap = false;
    this.inFavorites = false;
    this.inProfile = false;
  }

  toProfile(): void {
    this.inProfile = true;
    this.inMap = false;
    this.inFavorites = false;
    this.inChat = false;
  }

  onFavoritesUpdate(favorites: Favorite[]): void {
    this.favorites = favorites;
  }

  isAlreadyFavorite(): boolean {
    return this.favorites.some((favorite) => favorite.id === this.currentID);
  }

  addToFavorites(): void {
    const favorite: Favorite = this.jobMarkers.find((job) => job.id === this.currentID)!;

    if (!this.isAlreadyFavorite()) {
      favorite.owner = this.currentUser!.username;
      this.apiService.addFavorite(favorite).subscribe();
      this.favorites.push(favorite);
    }
  }
}

