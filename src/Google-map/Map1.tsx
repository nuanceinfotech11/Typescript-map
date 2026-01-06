import React, { useCallback, useRef, useState } from "react";
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const center = {
  lat: 24.6005,
  lng: 12.8322,
};

function Map1(): JSX.Element {
  const { isLoaded } = useJsApiLoader({ id: "ram", googleMapsApiKey: "AIzaSyAzWKGxZZskJtVG-nHHScjFV1K7E8MaxHY", libraries });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
 console.log("directions",directions)
  const mapRef = useRef<GoogleMap>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  async function handleDirections() {
    const startLocation = startInputRef.current?.value;
    const endLocation = endInputRef.current?.value;
   
    if (!startLocation || !endLocation) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        setDirections(result);
      } else {
        console.error(`Directions request failed with status: ${status}`);
        setDirections(null);
      }
    });
  }

  function clearInputs() {
    setDirections(null);
    startInputRef.current && (startInputRef.current.value = "");
    endInputRef.current && (endInputRef.current.value = "");
   
  }

  const onLoadCallback = useCallback((map: GoogleMap) => {
    console.log("hello")
   
  }, []);

  return isLoaded ? (
    <div>
      <div className="heading">
      <h2>Search Distance</h2>
      </div>
      <div className="form-div">
      <div className="label-input">
      <label>Start</label>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            startInputRef.current!.value = place.formatted_address || "";
          });
        }}
      >
        <input type="text" placeholder="Enter starting point" ref={startInputRef} />
      </Autocomplete>
      </div>
      <br />
      <div className="label-input">
      <label>End</label>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            endInputRef.current!.value = place.formatted_address || "";
          });
        }}
      >
        <input type="text" placeholder="End point" ref={endInputRef} />
      </Autocomplete>
     
      </div>
      <br />
      <div className="label-input">
      <button onClick={handleDirections}>Search</button>
      <button onClick={clearInputs}>Clear</button>
      </div>
      </div>
     
      <GoogleMap
      mapContainerClassName="GoogleMap"
        center={center}
        zoom={7}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
       
      >
        <Marker position={center} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default Map1;
