import { useEffect, useState } from "react";
import Home from "./Home";
import bgPhoto from "./assets/planet-earth-background.jpg";
import Question from "./Question";
function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [data, setData] = useState([])
  const [user, setUser] = useState()

  const getData = async () =>{
    const res = await fetch(`https://restcountries.com/v3.1/all?fields=name,flags`)
    const data = await res.json()
    setData(data)
  }

  useEffect(()=>{
    getData();
  },[])

  useEffect(()=>{
    console.log(data)
  },[data])

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${bgPhoto})`,
        backgroundSize: "cover",
        transition: "1s",
        backgroundPosition: "center",
      }}
    >
      {quizStarted ? <Question allCountries={data} user={user} quizEnd={()=>setQuizStarted(false)} /> : <Home setUser={setUser} quizStart={()=>setQuizStarted(true)} />}
    </div>
  );
}

export default App;
