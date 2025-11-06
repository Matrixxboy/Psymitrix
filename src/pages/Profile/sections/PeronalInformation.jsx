import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

const countries = [
  {
    "name": "Afghanistan",
    "code": "AF"
  },
  {
    "name": "Albania",
    "code": "AL"
  },
  {
    "name": "Algeria",
    "code": "DZ"
  },
  {
    "name": "American Samoa",
    "code": "AS"
  },
  {
    "name": "Andorra",
    "code": "AD"
  },
  {
    "name": "Angola",
    "code": "AO"
  },
  {
    "name": "Anguilla",
    "code": "AI"
  },
  {
    "name": "Antarctica",
    "code": "AQ"
  },
  {
    "name": "Antigua and Barbuda",
    "code": "AG"
  },
  {
    "name": "Argentina",
    "code": "AR"
  },
  {
    "name": "Armenia",
    "code": "AM"
  },
  {
    "name": "Aruba",
    "code": "AW"
  },
  {
    "name": "Australia",
    "code": "AU"
  },
  {
    "name": "Austria",
    "code": "AT"
  },
  {
    "name": "Azerbaijan",
    "code": "AZ"
  },
  {
    "name": "Bahamas",
    "code": "BS"
  },
  {
    "name": "Bahrain",
    "code": "BH"
  },
  {
    "name": "Bangladesh",
    "code": "BD"
  },
  {
    "name": "Barbados",
    "code": "BB"
  },
  {
    "name": "Belarus",
    "code": "BY"
  },
  {
    "name": "Belgium",
    "code": "BE"
  },
  {
    "name": "Belize",
    "code": "BZ"
  },
  {
    "name": "Benin",
    "code": "BJ"
  },
  {
    "name": "Bermuda",
    "code": "BM"
  },
  {
    "name": "Bhutan",
    "code": "BT"
  },
  {
    "name": "Bolivia",
    "code": "BO"
  },
  {
    "name": "Bosnia and Herzegovina",
    "code": "BA"
  },
  {
    "name": "Botswana",
    "code": "BW"
  },
  {
    "name": "Brazil",
    "code": "BR"
  },
  {
    "name": "British Indian Ocean Territory",
    "code": "IO"
  },
  {
    "name": "British Virgin Islands",
    "code": "VG"
  },
  {
    "name": "Brunei Darussalam",
    "code": "BN"
  },
  {
    "name": "Bulgaria",
    "code": "BG"
  },
  {
    "name": "Burkina Faso",
    "code": "BF"
  },
  {
    "name": "Burundi",
    "code": "BI"
  },
  {
    "name": "Cambodia",
    "code": "KH"
  },
  {
    "name": "Cameroon",
    "code": "CM"
  },
  {
    "name": "Canada",
    "code": "CA"
  },
  {
    "name": "Cape Verde",
    "code": "CV"
  },
  {
    "name": "Cayman Islands",
    "code": "KY"
  },
  {
    "name": "Central African Republic",
    "code": "CF"
  },
  {
    "name": "Chad",
    "code": "TD"
  },
  {
    "name": "Chile",
    "code": "CL"
  },
  {
    "name": "China",
    "code": "CN"
  },
  {
    "name": "Christmas Island",
    "code": "CX"
  },
  {
    "name": "Cocos (Keeling) Islands",
    "code": "CC"
  },
  {
    "name": "Colombia",
    "code": "CO"
  },
  {
    "name": "Comoros",
    "code": "KM"
  },
  {
    "name": "Congo",
    "code": "CG"
  },
  {
    "name": "Congo, Democratic People's Republic of the",
    "code": "CD"
  },
  {
    "name": "Cook Islands",
    "code": "CK"
  },
  {
    "name": "Costa Rica",
    "code": "CR"
  },
  {
    "name": "Croatia",
    "code": "HR"
  },
  {
    "name": "Cuba",
    "code": "CU"
  },
  {
    "name": "Cyprus",
    "code": "CY"
  },
  {
    "name": "Czech Republic",
    "code": "CZ"
  },
  {
    "name": "Côte d'Ivoire",
    "code": "CI"
  },
  {
    "name": "Denmark",
    "code": "DK"
  },
  {
    "name": "Djibouti",
    "code": "DJ"
  },
  {
    "name": "Dominica",
    "code": "DM"
  },
  {
    "name": "Dominican Republic",
    "code": "DO"
  },
  {
    "name": "Ecuador",
    "code": "EC"
  },
  {
    "name": "Egypt",
    "code": "EG"
  },
  {
    "name": "El Salvador",
    "code": "SV"
  },
  {
    "name": "Equatorial Guinea",
    "code": "GQ"
  },
  {
    "name": "Eritrea",
    "code": "ER"
  },
  {
    "name": "Estonia",
    "code": "EE"
  },
  {
    "name": "Ethiopia",
    "code": "ET"
  },
  {
    "name": "Falkland Islands (Malvinas)",
    "code": "FK"
  },
  {
    "name": "Faroe Islands",
    "code": "FO"
  },
  {
    "name": "Fiji",
    "code": "FJ"
  },
  {
    "name": "Finland",
    "code": "FI"
  },
  {
    "name": "France",
    "code": "FR"
  },
  {
    "name": "French Guiana",
    "code": "GF"
  },
  {
    "name": "French Polynesia",
    "code": "PF"
  },
  {
    "name": "French Southern Territories",
    "code": "TF"
  },
  {
    "name": "Gabon",
    "code": "GA"
  },
  {
    "name": "Gambia",
    "code": "GM"
  },
  {
    "name": "Georgia",
    "code": "GE"
  },
  {
    "name": "Germany",
    "code": "DE"
  },
  {
    "name": "Ghana",
    "code": "GH"
  },
  {
    "name": "Gibraltar",
    "code": "GI"
  },
  {
    "name": "Greece",
    "code": "GR"
  },
  {
    "name": "Greenland",
    "code": "GL"
  },
  {
    "name": "Grenada",
    "code": "GD"
  },
  {
    "name": "Guadeloupe",
    "code": "GP"
  },
  {
    "name": "Guam",
    "code": "GU"
  },
  {
    "name": "Guatemala",
    "code": "GT"
  },
  {
    "name": "Guernsey",
    "code": "GG"
  },
  {
    "name": "Guinea",
    "code": "GN"
  },
  {
    "name": "Guinea-Bissau",
    "code": "GW"
  },
  {
    "name": "Guyana",
    "code": "GY"
  },
  {
    "name": "Haiti",
    "code": "HT"
  },
  {
    "name": "Heard Island and McDonald Islands",
    "code": "HM"
  },
  {
    "name": "Holy See (Vatican City State)",
    "code": "VA"
  },
  {
    "name": "Honduras",
    "code": "HN"
  },
  {
    "name": "Hong Kong",
    "code": "HK"
  },
  {
    "name": "Hungary",
    "code": "HU"
  },
  {
    "name": "Iceland",
    "code": "IS"
  },
  {
    "name": "India",
    "code": "IN"
  },
  {
    "name": "Indonesia",
    "code": "ID"
  },
  {
    "name": "Iran, Islamic Republic of",
    "code": "IR"
  },
  {
    "name": "Iraq",
    "code": "IQ"
  },
  {
    "name": "Ireland",
    "code": "IE"
  },
  {
    "name": "Isle of Man",
    "code": "IM"
  },
  {
    "name": "Israel",
    "code": "IL"
  },
  {
    "name": "Italy",
    "code": "IT"
  },
  {
    "name": "Jamaica",
    "code": "JM"
  },
  {
    "name": "Japan",
    "code": "JP"
  },
  {
    "name": "Jersey",
    "code": "JE"
  },
  {
    "name": "Jordan",
    "code": "JO"
  },
  {
    "name": "Kazakhstan",
    "code": "KZ"
  },
  {
    "name": "Kenya",
    "code": "KE"
  },
  {
    "name": "Kiribati",
    "code": "KI"
  },
  {
    "name": "Korea, Democratic People's Republic of",
    "code": "KP"
  },
  {
    "name": "Korea, Republic of",
    "code": "KR"
  },
  {
    "name": "Kuwait",
    "code": "KW"
  },
  {
    "name": "Kyrgyzstan",
    "code": "KG"
  },
  {
    "name": "Lao People's Democratic Republic",
    "code": "LA"
  },
  {
    "name": "Latvia",
    "code": "LV"
  },
  {
    "name": "Lebanon",
    "code": "LB"
  },
  {
    "name": "Lesotho",
    "code": "LS"
  },
  {
    "name": "Liberia",
    "code": "LR"
  },
  {
    "name": "Libya",
    "code": "LY"
  },
  {
    "name": "Liechtenstein",
    "code": "LI"
  },
  {
    "name": "Lithuania",
    "code": "LT"
  },
  {
    "name": "Luxembourg",
    "code": "LU"
  },
  {
    "name": "Macao",
    "code": "MO"
  },
  {
    "name": "Macedonia, the Former Yugoslav Republic of",
    "code": "MK"
  },
  {
    "name": "Madagascar",
    "code": "MG"
  },
  {
    "name": "Malawi",
    "code": "MW"
  },
  {
    "name": "Malaysia",
    "code": "MY"
  },
  {
    "name": "Maldives",
    "code": "MV"
  },
  {
    "name": "Mali",
    "code": "ML"
  },
  {
    "name": "Malta",
    "code": "MT"
  },
  {
    "name": "Marshall Islands",
    "code": "MH"
  },
  {
    "name": "Martinique",
    "code": "MQ"
  },
  {
    "name": "Mauritania",
    "code": "MR"
  },
  {
    "name": "Mauritius",
    "code": "MU"
  },
  {
    "name": "Mayotte",
    "code": "YT"
  },
  {
    "name": "Mexico",
    "code": "MX"
  },
  {
    "name": "Micronesia, Federated States of",
    "code": "FM"
  },
  {
    "name": "Moldova, Republic of",
    "code": "MD"
  },
  {
    "name": "Monaco",
    "code": "MC"
  },
  {
    "name": "Mongolia",
    "code": "MN"
  },
  {
    "name": "Montenegro",
    "code": "ME"
  },
  {
    "name": "Montserrat",
    "code": "MS"
  },
  {
    "name": "Morocco",
    "code": "MA"
  },
  {
    "name": "Mozambique",
    "code": "MZ"
  },
  {
    "name": "Myanmar",
    "code": "MM"
  },
  {
    "name": "Namibia",
    "code": "NA"
  },
  {
    "name": "Nauru",
    "code": "NR"
  },
  {
    "name": "Nepal",
    "code": "NP"
  },
  {
    "name": "Netherlands",
    "code": "NL"
  },
  {
    "name": "New Caledonia",
    "code": "NC"
  },
  {
    "name": "New Zealand",
    "code": "NZ"
  },
  {
    "name": "Nicaragua",
    "code": "NI"
  },
  {
    "name": "Niger",
    "code": "NE"
  },
  {
    "name": "Nigeria",
    "code": "NG"
  },
  {
    "name": "Niue",
    "code": "NU"
  },
  {
    "name": "Norfolk Island",
    "code": "NF"
  },
  {
    "name": "Northern Mariana Islands",
    "code": "MP"
  },
  {
    "name": "Norway",
    "code": "NO"
  },
  {
    "name": "Oman",
    "code": "OM"
  },
  {
    "name": "Pakistan",
    "code": "PK"
  },
  {
    "name": "Palau",
    "code": "PW"
  },
  {
    "name": "Palestine, State of",
    "code": "PS"
  },
  {
    "name": "Panama",
    "code": "PA"
  },
  {
    "name": "Papua New Guinea",
    "code": "PG"
  },
  {
    "name": "Paraguay",
    "code": "PY"
  },
  {
    "name": "Peru",
    "code": "PE"
  },
  {
    "name": "Philippines",
    "code": "PH"
  },
  {
    "name": "Pitcairn",
    "code": "PN"
  },
  {
    "name": "Poland",
    "code": "PL"
  },
  {
    "name": "Portugal",
    "code": "PT"
  },
  {
    "name": "Puerto Rico",
    "code": "PR"
  },
  {
    "name": "Qatar",
    "code": "QA"
  },
  {
    "name": "Romania",
    "code": "RO"
  },
  {
    "name": "Russian Federation",
    "code": "RU"
  },
  {
    "name": "Rwanda",
    "code": "RW"
  },
  {
    "name": "Réunion",
    "code": "RE"
  },
  {
    "name": "Saint Barthélemy",
    "code": "BL"
  },
  {
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "code": "SH"
  },
  {
    "name": "Saint Kitts and Nevis",
    "code": "KN"
  },
  {
    "name": "Saint Lucia",
    "code": "LC"
  },
  {
    "name": "Saint Martin (French part)",
    "code": "MF"
  },
  {
    "name": "Saint Pierre and Miquelon",
    "code": "PM"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "code": "VC"
  },
  {
    "name": "Samoa",
    "code": "WS"
  },
  {
    "name": "San Marino",
    "code": "SM"
  },
  {
    "name": "Sao Tome and Principe",
    "code": "ST"
  },
  {
    "name": "Saudi Arabia",
    "code": "SA"
  },
  {
    "name": "Senegal",
    "code": "SN"
  },
  {
    "name": "Serbia",
    "code": "RS"
  },
  {
    "name": "Seychelles",
    "code": "SC"
  },
  {
    "name": "Sierra Leone",
    "code": "SL"
  },
  {
    "name": "Singapore",
    "code": "SG"
  },
  {
    "name": "Sint Maarten (Dutch part)",
    "code": "SX"
  },
  {
    "name": "Slovakia",
    "code": "SK"
  },
  {
    "name": "Slovenia",
    "code": "SI"
  },
  {
    "name": "Solomon Islands",
    "code": "SB"
  },
  {
    "name": "Somalia",
    "code": "SO"
  },
  {
    "name": "South Africa",
    "code": "ZA"
  },
  {
    "name": "South Georgia and the South Sandwich Islands",
    "code": "GS"
  },
  {
    "name": "South Sudan",
    "code": "SS"
  },
  {
    "name": "Spain",
    "code": "ES"
  },
  {
    "name": "Sri Lanka",
    "code": "LK"
  },
  {
    "name": "Sudan",
    "code": "SD"
  },
  {
    "name": "Suriname",
    "code": "SR"
  },
  {
    "name": "Svalbard and Jan Mayen",
    "code": "SJ"
  },
  {
    "name": "Swaziland",
    "code": "SZ"
  },
  {
    "name": "Sweden",
    "code": "SE"
  },
  {
    "name": "Switzerland",
    "code": "CH"
  },
  {
    "name": "Syrian Arab Republic",
    "code": "SY"
  },
  {
    "name": "Taiwan, Province of China",
    "code": "TW"
  },
  {
    "name": "Tajikistan",
    "code": "TJ"
  },
  {
    "name": "Tanzania, United Republic of",
    "code": "TZ"
  },
  {
    "name": "Thailand",
    "code": "TH"
  },
  {
    "name": "Timor-Leste",
    "code": "TL"
  },
  {
    "name": "Togo",
    "code": "TG"
  },
  {
    "name": "Tokelau",
    "code": "TK"
  },
  {
    "name": "Tonga",
    "code": "TO"
  },
  {
    "name": "Trinidad and Tobago",
    "code": "TT"
  },
  {
    "name": "Tunisia",
    "code": "TN"
  },
  {
    "name": "Turkey",
    "code": "TR"
  },
  {
    "name": "Turkmenistan",
    "code": "TM"
  },
  {
    "name": "Turks and Caicos Islands",
    "code": "TC"
  },
  {
    "name": "Tuvalu",
    "code": "TV"
  },
  {
    "name": "Uganda",
    "code": "UG"
  },
  {
    "name": "Ukraine",
    "code": "UA"
  },
  {
    "name": "United Arab Emirates",
    "code": "AE"
  },
  {
    "name": "United Kingdom",
    "code": "GB"
  },
  {
    "name": "United States",
    "code": "US"
  },
  {
    "name": "United States Minor Outlying Islands",
    "code": "UM"
  },
  {
    "name": "Uruguay",
    "code": "UY"
  },
  {
    "name": "Uzbekistan",
    "code": "UZ"
  },
  {
    "name": "Vanuatu",
    "code": "VU"
  },
  {
    "name": "Venezuela, Bolivarian Republic of",
    "code": "VE"
  },
  {
    "name": "Viet Nam",
    "code": "VN"
  },
  {
    "name": "Virgin Islands, U.S.",
    "code": "VI"
  },
  {
    "name": "Wallis and Futuna",
    "code": "WF"
  },
  {
    "name": "Western Sahara",
    "code": "EH"
  },
  {
    "name": "Yemen",
    "code": "YE"
  },
  {
    "name": "Zambia",
    "code": "ZM"
  },
  {
    "name": "Zimbabwe",
    "code": "ZW"
  }
];

const PersonalInformation = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState({});
  
  useEffect(() => {
    if (user) {
      setEditableUserData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        bloodgroup: user.bloodgroup || "",
        birthdate: user.birthdate ? formatDateForInput(user.birthdate) : "",
        olderSiblings: user.olderSiblings !== null && user.olderSiblings !== undefined ? user.olderSiblings : "",
        youngerSiblings: user.youngerSiblings !== null && user.youngerSiblings !== undefined ? user.youngerSiblings : "",
        height: user.height !== null && user.height !== undefined ? user.height : "",
        weight: user.weight !== null && user.weight !== undefined ? user.weight : "",
        occupation: user.occupation || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setEditableUserData((prev) => ({ ...prev, [key]: value }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(editableUserData);
    setIsEditing(false);
  };

  const infoItems = [
    { title: "First Name", key: "firstName", value: editableUserData.firstName , type: "text" , placeholder: "Enter your First Name"},
    { title: "Middle Name", key: "middleName", value: editableUserData.middleName , type: "text" , placeholder: "Enter yourMiddle Name"},
    { title: "Last Name", key: "lastName", value: editableUserData.lastName , type: "text" , placeholder: "Enter your Last Name"},
    { title: "Gender", key: "gender", value: editableUserData.gender , type: "text" , placeholder: "Enter your Gender"},
    { title: "Blood Group", key: "bloodgroup", value: editableUserData.bloodgroup , type: "text" , placeholder: "Enter your Blood Group"},
    { title: "Date of Birth", key: "birthdate", value: editableUserData.birthdate , type: "date", placeholder: "Enter your Date of Birth"},
    { title: "Older Siblings", key: "olderSiblings", value: editableUserData.olderSiblings , type: "number" , placeholder: "Enter your Older Siblings"},
    { title: "Younger Siblings", key: "youngerSiblings", value: editableUserData.youngerSiblings , type: "number" , placeholder: "Enter your Younger Siblings"},
    { title: "height", key: "height", value: editableUserData.height , type: "number" , unit: "cm", placeholder: "Enter your Height"},
    { title: "weight", key: "weight", value: editableUserData.weight , type: "number" , unit: "kg", placeholder: "Enter your Weight"},
    { title: "occupation", key: "occupation", value: editableUserData.occupation , type: "text" , placeholder: "Enter your Occupation"},
    { title: "location", key: "location", value: editableUserData.location , type: "select", options: countries },
  ];

  return (
    <div className="p-6 rounded-3xl bg-light-secondary/40 dark:bg-dark-secondary/30 
      backdrop-blur-lg shadow-lg border border-light-accent/10 dark:border-dark-accent/10 
      transition-all duration-300 hover:shadow-xl hover:border-light-accent/30 dark:hover:border-dark-accent/30">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings">
          Personal Information
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-light-primary text-white 
              hover:bg-light-primary/90 dark:hover:bg-dark-accent/80 transition"
          >
            Edit
          </button>
        )}
      </div>

      {/* Display Mode */}
      {!isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {infoItems.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/30 border 
                border-transparent hover:border-light-accent/30 dark:hover:border-dark-accent/30 
                backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
            >
              <h4 className="text-sm text-light-body dark:text-dark-body mb-1">{item.title}</h4>
              <p className="text-lg font-semibold text-light-headings dark:text-dark-headings">
                {item.value === null || item.value === undefined || item.value === '' ? "—" : item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2"
        >
          {infoItems.map((item) => (
            <div key={item.key}>
              <label
                htmlFor={item.key}
                className="block text-sm font-medium text-light-headings dark:text-dark-headings mb-1"
              >
                {item.title}
              </label>
              {item.type === "select" ? (
                <select
                  id={item.key}
                  value={item.value}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 
                    dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/40 
                    focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent 
                    focus:outline-none text-light-headings dark:text-dark-headings transition"
                >
                  <option value="">Select a country</option>
                  {item.options.map((option) => (
                    <option key={option.code} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={item.key}
                  type={item.type}
                  value={item.value}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 
                    dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/40 
                    focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent 
                    focus:outline-none text-light-headings dark:text-dark-headings transition"
                />
              )}
            </div>
          ))}

          <div className="col-span-full flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 
                hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-light-primary text-white rounded-md 
                hover:bg-light-primary/90 dark:hover:bg-dark-accent/80 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInformation;
