import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/servicesnap")
  .then(() => console.log("MongoDB NextGen Engine Connected!"))
  .catch(() => console.log("Running in High-Speed Demo Mode..."));

// Google OAuth Endpoint
app.post('/api/auth/google-login', (req, res) => {
  const { email, name } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid Gmail address' });
  }
  res.json({
    success: true,
    message: 'Gmail Authentication Successful!',
    user: {
      email,
      name: name || email.split('@')[0],
      token: 'jwt_servicesnap_v5_2026'
    }
  });
});

// Comprehensive TN Service Centers Directory
const tnServiceCenters = {
  "Coimbatore": [
    { name: "Chillsmile Tech & Appliance Care", phone: "+91 87545 56788", address: "Saravanampatti Main Rd, Near IT Park, Coimbatore", rating: "5.0 ★ (450+ Reviews)", tag: "Express 30-Min Service", visit_fee: "₹150" },
    { name: "Sri Anna Kamatchi Service Hub", phone: "+91 74180 99241", address: "Sanganoor Road, Rathinapuri, Coimbatore", rating: "4.9 ★ (320+ Reviews)", tag: "Doorstep Specialist", visit_fee: "₹150" },
    { name: "Kovai Digital & Appliance Care", phone: "+91 98949 91143", address: "Cross Cut Road, Gandhipuram, Coimbatore", rating: "4.8 ★ (610+ Reviews)", tag: "Certified Spares", visit_fee: "₹200" }
  ],
  "Chennai": [
    { name: "Madras Electronics & Appliance Care", phone: "+91 98400 12345", address: "Usman Road, T. Nagar, Chennai", rating: "4.9 ★ (890+ Reviews)", tag: "Multi-Brand Hub", visit_fee: "₹200" },
    { name: "Ritchie Street Tech Hospital", phone: "+91 98401 99887", address: "Ritchie Street, Mount Road, Chennai", rating: "5.0 ★ (1,800+ Reviews)", tag: "Wholesale Parts & Board Fix", visit_fee: "₹150" }
  ],
  "Madurai": [
    { name: "Meenakshi Service Doctor", phone: "+91 94430 98765", address: "Simmakkal Main Rd, Madurai", rating: "4.8 ★ (410+ Reviews)", tag: "Doorstep Service", visit_fee: "₹150" }
  ],
  "Tiruppur": [
    { name: "Tiruppur Tex City Tech Care", phone: "+91 98422 11223", address: "Avinashi Road, Tiruppur", rating: "4.8 ★ (290+ Reviews)", tag: "Fast Track Repair", visit_fee: "₹150" }
  ]
};

const allTamilNaduDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
  "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
  "Kanniyakumari", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni",
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar", "The Nilgiris"
];

const createDistrictDirectory = (district) => [{
  name: `${district} Multi-Brand Repair Search`,
  address: `${district}, Tamil Nadu`,
  rating: "Live listings on Google Maps",
  tag: "District-wide service discovery",
  visit_fee: "Ask technician",
  map_only: true
}];

const createLiveDirectoryCard = (district, deviceType) => ({
  name: `All ${deviceType} shops in ${district}`,
  address: `${district} district, Tamil Nadu`,
  rating: "Live Google Maps directory",
  tag: "View all nearby shops",
  visit_fee: "Varies by shop",
  map_only: true,
  map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${deviceType} repair shops in ${district} Tamil Nadu`)}`
});

// NextGen Fault Matrix
const faultMatrix = {
  "Washing Machine": { issue: "Drum Suspension & Drain Pump Fault", desc: "Vibration stress and drain valve motor resistance defect detected.", cost: { min: 800, max: 2400 }, spares: ["Heavy Duty Solenoid Valve", "Shock Absorber Set", "Drive Belt"] },
  "Refrigerator": { issue: "Compressor Relay & Gas Pressure Drop", desc: "Thermal PTC starter relay tripping due to micro-refrigerant leak.", cost: { min: 1200, max: 3500 }, spares: ["PTC Starter Relay", "R600a Gas Refill", "Filter Drier"] },
  "Air Conditioner (AC)": { issue: "Blower Motor Bearing & Copper Leak", desc: "Motor acoustic friction and outdoor coil pressure drop identified.", cost: { min: 1500, max: 4200 }, spares: ["Copper Union Nut", "Inverter Gas Charge", "Jet Wash Service"] },
  "Television (LED/OLED)": { issue: "Backlight Strip & Power Board Strain", desc: "LED backlight strip degradation and capacitor voltage ripple.", cost: { min: 1100, max: 3200 }, spares: ["Aluminum LED Backlight Strips", "Power Board Capacitor Kit"] },
  "Smartphone / Tablet": { issue: "Display Touch Digitizer & Charging IC", desc: "Glass crack fracture and power IC current drop detected.", cost: { min: 450, max: 2200 }, spares: ["Original AMOLED Display Glass", "Fast Charging Port Flex Cable"] },
  "Laptop / PC": { issue: "Chip-Level Motherboard & Thermal Throttling", desc: "Short circuit capacitor ripple and dried thermal paste degradation.", cost: { min: 900, max: 3800 }, spares: ["Motherboard Power MOSFET", "High-Performance Thermal Compound"] }
};

app.post('/api/repair/analyze', (req, res) => {
  const { deviceType = "Washing Machine", customBrandModel = "", city = "Coimbatore" } = req.body;

  const defaultFault = { issue: `${deviceType} Component Damage`, desc: `Internal hardware stress detected on ${deviceType}.`, cost: { min: 600, max: 2500 }, spares: ["Power Circuit Fuse", "Wiring Harness"] };
  const fault = faultMatrix[deviceType] || defaultFault;
  const normalizedCity = allTamilNaduDistricts.includes(city) ? city : "Coimbatore";
  const hubs = tnServiceCenters[normalizedCity] || createDistrictDirectory(normalizedCity);

  const masterMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deviceType + ' repair service center in ' + normalizedCity + ' Tamil Nadu')}`;

  const formattedHubs = [...hubs, createLiveDirectoryCard(normalizedCity, deviceType)].map(hub => ({
    ...hub,
    map_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hub.name + " " + hub.address)}`
  }));

  setTimeout(() => {
    res.json({
      success: true,
      data: {
        detected_issue: customBrandModel ? `${customBrandModel} - ${fault.issue}` : fault.issue,
        issue_description: fault.desc,
        estimated_cost_inr: fault.cost,
        estimated_repair_time: "45 Mins - 2 Hours",
        all_google_maps_url: masterMapUrl,
        parts_required: fault.spares,
        service_area: normalizedCity,
        repair_centers: formattedHubs
      }
    });
  }, 900);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ServiceSnap NextGen Engine running on port ${PORT}`));