import React, {useState, useContext, useEffect} from 'react';
import Card from './components/cards/Card';
import Header from './components/header/Header';
import Filter from './components/filters/Filter';
import Info from './components/info/Info';
import Back from './back.svg';
import { ThemeContext } from './ThemeProvider';
import AppTheme from './AppTheme';

import './App.scss';

const App = () => {
  const regions = ['Filter by region', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']; // regions
  const [arrayCountries, setArrayCountries] = useState([]); // list of countries
  const [infoShow, setInfoShow] = useState({modal: false, countryInfo: []}); // show about country
  const {theme, toggleTheme} = useContext(ThemeContext); // select theme
  const [filterRegion, setFilterRegion] = useState({dropdown: false, filterName: ''}); // filter for regions
  const [filterCountry, setFilterCountry] = useState(''); // filter name country
  const [hasError, setError] = useState({error: 'not error', show: false});

  // all list countries
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://restcountries.eu/rest/v2/all`);
      res
      .json()
      .then(res => {
          setArrayCountries(res)
          setError({error: 'not error', show: false})
      })
    }
    fetchData();
  }, []);

  // filter country name
  const changeSearch = async(country) => {
    let filterSelect = country.target.value;
    setFilterCountry(filterSelect);

    if(filterSelect) {
      const res = await fetch(`https://restcountries.eu/rest/v2/name/${filterSelect}`);

      if (res.status === 200) {
        res.json().then(
          res => setArrayCountries(res),
          setError({error: 'not error', show: false})
        )
      }

      if (res.status === 404) {
        res.json().then(res => setError({error: res.message, show: true}))
      }
    } else {
      const res = await fetch(`https://restcountries.eu/rest/v2/all`);
      res
      .json()
      .then(res => {
          setArrayCountries(res)
          setError({error: 'not error', show: false})
      })
    }
  }


  const changeFilter = async (name) => {
    setFilterRegion({filterName: name, dropdown: false});

    if(name) {
      if (name !== 'Filter by region') {
        const res = await fetch(`https://restcountries.eu/rest/v2/region/${name}`);

        if (res.status === 200) {
          res.json().then(
            res => setArrayCountries(res),
            setError({error: 'not error', show: false})
          )
        }
  
        if (res.status === 404) {
          res.json().then(res => setError({error: res.message, show: true}))
        }
      } else {
        const res = await fetch(`https://restcountries.eu/rest/v2/all`);
        res
        .json()
        .then(res => {
            setArrayCountries(res)
            setError({error: 'not error', show: false})
        })
      } 
    }
  }

  const openCard = async(name) => {
    if(name) {
      const res = await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
      res.json().then(res => setInfoShow({countryInfo: res, modal: true }));
    }
  }

  const openDropdown = () => {
    if(filterRegion.dropdown === false) {
      setFilterRegion({filterName: filterRegion.filterName, dropdown: true})
    } else {
      setFilterRegion({filterName: filterRegion.filterName, dropdown: false})
    }
  }

  const openInfo = () => {
    if(infoShow.modal === true) {
      setInfoShow({countryInfo: [], modal: false})
    }
  }

  const currentTheme = AppTheme[theme];

  return (
    <div className="wrapper" style={{backgroundColor: `${currentTheme.backgroundBody}`}}>

      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <div className="wrapper__box">

        {
          infoShow.modal === true ?
           <div> 
            <div className="btn">
              <button
                style={{
                  backgroundColor: `${currentTheme.backgroundColor}`,
                  color: `${currentTheme.textColor}`,
                  boxShadow: `${currentTheme.boxShadow}`
                }}
                className="back" onClick={openInfo}><img className="arrow" src={Back} alt="" />Back</button>
            </div>
            <main className="content-info">
                {
                infoShow.countryInfo ? infoShow.countryInfo.map((name, index) => 
                <Info theme={theme} key={index} data={name} />) : ''
              }
            </main>
          </div>
          :

          <div>
            <Filter
              theme={theme}
              changeSearch={changeSearch}
              filterCountry={filterCountry}
              openDropdown={openDropdown}
              filter={filterRegion}
              changeFilter={changeFilter}
              regions={regions} />

            <main className="content">
              {
                hasError.show  === true ? <div>{hasError.error}</div> :
                arrayCountries.map((country, index) => (
                  <Card theme={theme} key={index} country={country} openCard={openCard} />
                ))
              }
            </main>

          </div>
        }
       
      </div>
    </div>
  );
}

export default App;
