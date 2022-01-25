import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, scan } from 'rxjs/operators';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

// import { circle, geoJSON, icon, latLng, Layer, marker, polygon, tileLayer } from 'leaflet';
import { APIService } from 'src/app/shared/APIService';
import { HelperService } from 'src/app/shared/helper.service';

// import  tt  from '@tomtom-international/web-sdk-maps';
import { MapsAPILoader } from '@agm/core';

//355e7983373a0a5d - google maps id.

//AIzaSyD44s7WG-RzfoEqvL6Cdoa81jhmkrRwUFI
// npm i @types/googlemaps@3.39.13 --save-dev

import * as L from "leaflet";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder";
import * as ELG from "esri-leaflet-geocoder";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { threadId } from 'worker_threads';

// import marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
});

@Component({
  selector: 'app-qrcodegenerate',
  templateUrl: './qrcodegenerate.component.html',
  styleUrls: ['./qrcodegenerate.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class QrcodegenerateComponent implements OnInit {

  // title: string = 'AGM project';
  // latitude: number;
  // longitude: number;
  // zoom:number;
  // address: string;
  // private geoCoder;

  // @ViewChild('search')
  // public searchElementRef: ElementRef;

  isVisible = false;
  isOkLoading = false;

  latLong;
  eventCount = 0;
  eventLog: string = '';
  eventSubject = new Subject<string>();
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  qrCodeForm: FormGroup;
  qrcodeData;
  qrcode_id;

  modalHeaderNm;
  //	LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' });

  // options = {
  //   layers: [ this.LAYER_OSM ],
  // 	zoom: 11,
  // 	center: latLng([18.516726,73.856255])
  // };
  // markers: Layer[] = [];

  officeList = [];
  isLocation: boolean = false;
  isViewQrcode: boolean = false;
  isaddLoSubmitLoading: boolean = false;
  locationNewValue = "";

  loading = true;

  office_id;
  officeLat;
  officeLng;
  shortOfficeName;
  getQrcodeList = [];
  allowDistance = null;

  //  for qr code

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value: any = null;
  value1: any = "ABC";

  marker;

  constructor(
    public apiService: APIService,
    public helper: HelperService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public router: Router,
    public fb: FormBuilder
  ) {
    // this.qrCodeForm = this.fb.group({
    //   shortOfficeName: ['', [Validators.required]],
    //   officeLat: ['', [Validators.required]],
    //   officeLng: ['', [Validators.required]],
    //   officeName: ['', [Validators.required]],
    // });
  }
  updateEditCache(): void {
    this.getQrcodeList.forEach(item => {
      this.editCache[item.qrcode_id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.getQrcodeList.findIndex(item => item.qrcode_id === id);
    this.editCache[id] = {
      data: { ...this.getQrcodeList[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.loading = true;
    const index = this.getQrcodeList.findIndex(item => item.qrcode_id === id);
    // console.log(Object.assign(this.listOfData[index], this.editCache[id].data));

    let updateQrCodeInfo = Object.assign(this.getQrcodeList[index], this.editCache[id].data, { update: 1 });
    // return  console.log(updateQrCodeInfo)
    this.apiService.updateQrCode(updateQrCodeInfo).subscribe(res => {
      // console.log(res);
      this.loading = false;
      // this.ngOnInit();
      this.helper.newopenAlertBox('success', 'QR Code update successfully');
      this.getQrcodeOfficeInfo();

    }, (e) => {
      console.log(e)
      this.helper.newopenAlertBox('error', e);
    });
    this.editCache[id].edit = false;
  }
  ngOnInit(): void {
    this.getQrcodeOfficeInfo();
    this.getOfficeLocation();
    // this.isVisible = true;

    var map = L.map("map").setView([18.516726, 73.856255], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searchControl = new ELG.Geosearch();

    const results = new L.LayerGroup().addTo(map);

    console.log(new ELG.ReverseGeocode());

    map.on("click", (e) => {

      console.log(e.latlng);
      console.log(e.latlng.lat);
      this.officeLat = e.latlng.lat;
      this.officeLng = e.latlng.lng;

      new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
        if (error) {
          return;
        }
        if (this.marker && map.hasLayer(this.marker))
          map.removeLayer(this.marker);

        this.marker = L.marker(result.latlng)
          .addTo(map)
          .bindPopup(result.address.Match_addr)
          .openPopup();
      });
    });

    searchControl
      .on("results", function (data) {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      }).addTo(map);

    console.log(new ELG.ReverseGeocode());
    map.on("click", (e) => {
      new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
        if (error) {
          return;
        }

        if (this.marker && map.hasLayer(this.marker))
          map.removeLayer(this.marker);

        this.showModal(0);
        this.marker = L.marker(result.latlng)
          .addTo(map)
          .bindPopup(result.address.Match_addr)
          .openPopup();
      });
    });

  }


  getOfficeLocation() {
    this.apiService.getOfficeList().subscribe(res2 => {
      console.log(res2);
      this.officeList = res2;
    }, (e) => { console.log(e) });

  }

  onChange(value: string) {
    console.log(value);
    console.log(this.office_id);
    if (value !== null) {
      this.office_id = value;
    }

  }


  addField(e?: MouseEvent, fill_id?: string, Modaltitle?: string) {

    if (e) {
      e.preventDefault()
    }

    this.isLocation = true;
    this.isViewQrcode = true;
  }
  cancelField() {
    this.isViewQrcode = false;
  }


  addLocation() {
    console.log(this.locationNewValue);
    this.isaddLoSubmitLoading = true;
    this.apiService.addOffice({ o_name: this.locationNewValue }).subscribe(res => {

      this.getOfficeLocation();
      this.helper.newopenAlertBox('success', `Location add successfully`);

      this.isaddLoSubmitLoading = false;
      console.log(res);
      this.locationNewValue = "";

    }, e => {
      console.log(e);

      this.helper.newopenAlertBox('error', e);
      this.isaddLoSubmitLoading = false;
    });

  }

  showModal(isAdd): void {
    isAdd == 0 ? this.modalHeaderNm = "Add Qr Code" : this.modalHeaderNm = "Update Qr Code";
    this.isVisible = true;
  }

  handleCancel(): void {
    this.clearOfficeForm();

    this.isVisible = false;
  }

  downloadQrCode() {
    const fileNameToDownload = `office_${this.qrcodeData.data.officecode}`;

    const base64Img = document.getElementsByClassName('coolQRCode')[0].children[0]['src'];
    fetch(base64Img)
      .then(res => res.blob())
      .then((blob) => {
        console.log(blob);
        // Chrome
        console.log("Download QR code In Chrome")
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileNameToDownload;
        link.click();

      }).catch(e => {
        console.log(e);
      })
  }

  public saveQRCode() {
    console.log(this.value);
    if (this.officeLat != null && this.officeLng != null && this.office_id != null && this.shortOfficeName != null && this.allowDistance != null) {
      if (this.modalHeaderNm == "Add Qr Code") {
        this.apiService.qrcodeGeneration({ office_id: +this.office_id, short_office_nm: this.shortOfficeName, lat: this.officeLat, lng: this.officeLng, allow_distance: this.allowDistance }).subscribe(res => {
          console.log(res);
          this.helper.newopenAlertBox('success', `Qr Code save successfully`);
          this.isVisible = false;
          // this.genQrCode();
          this.clearOfficeForm();
          this.getQrcodeOfficeInfo();

        }, (e) => {
          console.log(e);
          this.helper.newopenAlertBox('error', e);

        });
      } else {
        this.apiService.updateQrCode({ office_id: +this.office_id,qrcode_id: +this.qrcode_id, short_office_name: this.shortOfficeName, lat: this.officeLat, lng: this.officeLng, allow_distance: this.allowDistance }).subscribe(res => {
          this.isVisible = false;
          if(res ==1){
            this.helper.newopenAlertBox('success', 'QR Code updated successfully');
            this.clearOfficeForm();
            this.getQrcodeOfficeInfo();
          }else{
            this.helper.newopenAlertBox('error', 'Something went to wrong');
          }

        }, (e) => {
          console.log(e)
          this.helper.newopenAlertBox('error', e);
        });

      }
    }
    else {

      this.helper.newopenAlertBox('error', `Please Fill the Information`);

    }


  }

  getQrcodeOfficeInfo() {
    this.apiService.getQrcodeInfo().subscribe((res: []) => {
      console.log(res);
      this.loading = false;
      this.getQrcodeList = res;
      this.updateEditCache();
    }, (e) => {
      this.loading = false;
      console.log(e);
    })
  }
  deleteQrCode(id: any) {
    this.loading = true;
    this.apiService.deleteQrCode(id).subscribe(res => {
      this.loading = false;
      this.getQrcodeOfficeInfo();
      this.helper.newopenAlertBox('success', `Delete QR Code Successfully`);

    }, (e) => {
      this.loading = false;
      this.helper.newopenAlertBox('error', e);

    })
  }

  updateQrCode(data) {
    console.log(data);
    this.shortOfficeName = data.short_office_name;
    this.officeLat = data.latitude;
    this.officeLng = data.longitude;
    this.allowDistance = data.allowed_distance;
    this.office_id = data.office_id.toString();
    console.log(this.office_id);
    this.qrcode_id =data.qrcode_id
    this.showModal(1);
  }

  viewQrCode(data: any) {
    this.isViewQrcode = true;

     this.qrcodeData = { "data": { "lat": data.latitude, "long": data.longitude, "officecode": data.office_id, "sub_office_id": data.sub_office_id } }
    console.log(this.qrcodeData);
    let objJsonB64 = btoa(JSON.stringify(this.qrcodeData));
    // acutal base 64 string 
    this.value = objJsonB64;
    console.log(this.value);
    // this.downloadQrCode(data.office_id);
  }

  clearOfficeForm() {
    this.officeLat = null;
    this.officeLng = null;
    this.office_id =null;
    this.shortOfficeName = null;
    this.allowDistance =null;
    // this.officeList = [];
    // this.getQrcodeOfficeInfo();
  }
}



/*


    leaflet code

  handleEvent(eventType: string,ev) {

  let  oldMarker;


  if(this.markers.length !=0){
    this.markers.pop();
  }
       console.log(ev.latlng);

        this.officeLat =ev.latlng.lat;
        this.officeLng =ev.latlng.lng;


      //   this.addMarker();

      const newMarker = marker(
        // [ 18.516726 + 0.1 * (Math.random() - 0.5), 73.856255+ 0.1 * (Math.random() - 0.5) ],
        ev.latlng,
        {
          icon: icon({
            iconSize: [ 40, 40 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'assets/img/maps/office.png',
          //	iconRetinaUrl: '680f69f3c2e6b90c1812a813edf67fd7.png',
          //	shadowUrl: 'a0c6cc1401c107b501efee6477816891.png'
          })
        }
      );

   oldMarker   =this.markers.push(newMarker);
console.log(oldMarker);
     this.showModal();

  }



--------------------------------------

const map = tt.map({
  key: 'DiBlIzAoVbDuHXXggAYc57LfeVPDwNbM',
  container: 'map',
  center: [4.876935, 52.360306],
  zoom: 13
});
map.addControl(new tt.NavigationControl());

this.geo= map.addControl(new tt.GeolocateControl({ positionOptions: {
  enableHighAccuracy: true
},
trackUserLocation: true
}));

map.on('load', function() {
  map.showTrafficFlow();
});

  }


*/


// for plain leaflet

/*
if (!navigator.geolocation) {
      console.log('location is not supported');


      this.pos =  [18.516726,73.856255]
      this.mymap = L.map('mapid').setView(this.pos, 13);
    }


    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      const latLong = [coords.latitude, coords.longitude];
      console.log(
        `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
      );

      console.log(latLong);

    });





      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVuemltYTEyMyIsImEiOiJja25scnFxdzcwbnIyMndwbTIyYjBibGZnIn0.K6am5WaNpdZX-mT7ONiPpg',
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiYmVuemltYTEyMyIsImEiOiJja25scnFxdzcwbnIyMndwbTIyYjBibGZnIn0.K6am5WaNpdZX-mT7ONiPpg',
        }
      ).addTo(this.mymap);

      // let marker = L.marker(pos).addTo(mymap);

      // marker.bindPopup('<b>Hi</b>').openPopup();

      // let popup = L.popup()
      //   .setLatLng(latLong)
      //   .setContent('I am Subrat')
      //   .openOn(mymap);


      this.mymap.on('click', onMapClick);

   let theMarker = {};

      function onMapClick(e) {

            console.log(this.visible);

        this.visible =true;
        this.isVisible = true;

        console.log(this.visible);
        //   alert("You clicked the map at " + e.latlng);
      console.log(e);
    let  greenIcon = L.icon({
        iconUrl: 'assets/img/maps/office.png',
        // shadowUrl: 'leaf-shadow.png',

        iconSize:     [50, 50], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    if (theMarker != undefined) {
      this.mymap.removeLayer(theMarker);
};

 theMarker =    L.marker(e.latlng,{icon: greenIcon}).addTo(this.mymap);
 console.log(theMarker);

    }




*/