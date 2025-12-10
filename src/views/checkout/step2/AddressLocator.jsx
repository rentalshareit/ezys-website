import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { EnvironmentOutlined, AimOutlined } from "@ant-design/icons";

function MapMarkers({ markerPosition, onMarkerDragEnd, panToPosition }) {
  const map = useMap();

  React.useEffect(() => {
    if (map && panToPosition) {
      const latLng = new window.google.maps.LatLng(
        panToPosition.lat,
        panToPosition.lng
      );
      map.panTo(latLng);
      map.setZoom(15);
    }
  }, [map, panToPosition]);

  return (
    <Marker
      position={markerPosition}
      draggable
      onDragEnd={onMarkerDragEnd}
      label={{
        text: "Drag this pin or search location",
        className: "custom-marker-label",
      }}
    />
  );
}

function AddressLocator({ apiKey, onSelect }) {
  const [pinCode, setPinCode] = useState("");
  const [initialPosition, setInitialPosition] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [panToPosition, setPanToPosition] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [formattedAddress, setFormattedAddress] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setInitialPosition(pos);
        setMarkerPosition(pos);
        setPanToPosition(pos);
      });
    }
  }, []);

  useEffect(() => {
    if (
      isApiLoaded &&
      window.google &&
      inputRef.current &&
      !autocompleteRef.current
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: "IN" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const location = place.geometry.location;
        const latLng = { lat: location.lat(), lng: location.lng() };

        setMarkerPosition(latLng);
        setPanToPosition(latLng);
      });
    }
  }, [isApiLoaded, inputRef.current]);

  useEffect(() => {
    if (isApiLoaded && window.google && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isApiLoaded]);

  useEffect(() => {
    if (onSelect && formattedAddress) {
      onSelect({
        address: formattedAddress,
        pinCode: pinCode,
        position: markerPosition,
      });
    }
  }, [formattedAddress, pinCode]);

  const reverseGeocode = (latLng, retries = 3) => {
    if (!geocoderRef.current) {
      // Retry if geocoder is not initialized
      if (retries > 0) {
        setTimeout(() => reverseGeocode(latLng, retries - 1), 1000);
      } else {
        console.error("Geocoder not initialized.");
        setFormattedAddress("");
        setPinCode("");
      }
      return;
    }

    geocoderRef.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        const components = results[0].address_components;
        let pinCode = "";
        components.forEach((component) => {
          if (component.types.includes("postal_code")) {
            pinCode = component.long_name;
          }
        });

        const placeId = results[0].place_id;
        if (placeId) {
          const service = new window.google.maps.places.PlacesService(
            document.createElement("div")
          );
          service.getDetails({ placeId }, (place, placeStatus) => {
            if (placeStatus === "OK" && place.name) {
              setFormattedAddress(`${place.name}, ${address}`);
            } else {
              setFormattedAddress(address);
            }
          });
        } else {
          setFormattedAddress(address);
        }

        setPinCode(pinCode);
      } else if (retries > 0) {
        // Retry the reverse geocoding
        setTimeout(() => reverseGeocode(latLng, retries - 1), 1000);
      } else {
        // Fallback to default message after retries
        console.error("Reverse geocoding failed:", status);
        setFormattedAddress("");
        setPinCode("");
      }
    });
  };

  useEffect(() => {
    if (markerPosition) {
      reverseGeocode(markerPosition);
    }
  }, [markerPosition]);

  const onApiLoad = () => {
    setIsApiLoaded(true);
  };

  const onZoomChange = (ev) => {
    setZoom(ev.detail.zoom);
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const latLng = { lat, lng };
    setMarkerPosition(latLng);
    setPanToPosition(latLng);
    reverseGeocode(latLng);
  };

  const resetToUserLocation = () => {
    if (initialPosition) {
      setMarkerPosition(initialPosition);
      setPanToPosition(initialPosition);
      setZoom(15);
    }
  };

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]} onLoad={onApiLoad}>
      {initialPosition && (
        <>
          <input
            type="text"
            placeholder="Search your address or nearby location"
            ref={inputRef}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <div style={{ position: "relative" }}>
            <Map
              defaultCenter={initialPosition}
              zoom={zoom}
              options={{
                draggable: true,
                zoomControl: true,
                fullscreenControl: false,
                streetViewControl: false,
              }}
              onZoomChanged={onZoomChange}
              style={{ height: 400, width: "100%" }}
            >
              <MapMarkers
                markerPosition={markerPosition}
                onMarkerDragEnd={onMarkerDragEnd}
                panToPosition={panToPosition}
              />
            </Map>
            {/* Reset button near zoom controls */}
            <button
              onClick={resetToUserLocation}
              title="Reset to current location"
              aria-label="Reset to current location"
              style={{
                position: "absolute",
                bottom: 200, // adjust to appear above zoom control (zoom control usually top-right at ~56px)
                right: 16,
                backgroundColor: "white",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                zIndex: 10,
              }}
            >
              <AimOutlined
                style={{ color: "rgb(13, 148, 136)", fontSize: 18 }}
              />
            </button>
          </div>

          <div
            className="address-label"
            style={{
              color: "rgb(13, 148, 136)",
              marginBottom: "8px",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            Your order will be delivered at:
          </div>
          <div
            className="formatted-address"
            style={{
              marginLeft: "16px",
              marginBottom: "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <EnvironmentOutlined style={{ marginRight: "8px" }} />
            <span>{formattedAddress || "No address selected yet."}</span>
          </div>
        </>
      )}
    </APIProvider>
  );
}

export default AddressLocator;
