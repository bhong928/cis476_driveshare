// /src/lib/CarListingBuilder.js
class CarListingBuilder {
    constructor() {
      this.listing = {};
    }
  
    setMake(make) {
      this.listing.make = make;
      return this;
    }
  
    setModel(model) {
      this.listing.model = model;
      return this;
    }
  
    setYear(year) {
      this.listing.year = year;
      return this;
    }
  
    setMileage(mileage) {
      this.listing.mileage = mileage;
      return this;
    }
  
    setAvailabilityStart(date) {
      this.listing.availabilityStart = date;
      return this;
    }
  
    setAvailabilityEnd(date) {
      this.listing.availabilityEnd = date;
      return this;
    }
  
    setLocation(location) {
      this.listing.location = location;
      return this;
    }
  
    setPrice(price) {
      this.listing.price = price;
      return this;
    }
  
    setOwnerId(ownerId) {
      this.listing.ownerId = ownerId;
      return this;
    }
  
    setIsBooked(isBooked) {
      this.listing.isBooked = isBooked;
      return this;
    }
  
    setCreatedAt(createdAt) {
      this.listing.createdAt = createdAt;
      return this;
    }
  
    build() {
      return this.listing;
    }
  }
  
  export default CarListingBuilder;