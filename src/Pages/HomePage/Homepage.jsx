import React, { useEffect, useState } from "react";
import header2 from "../../Images/header2.png";
import header3 from "../../Images/header3.png";
import header4 from "../../Images/header4.png";
import headerlast from "../../Images/headerlast.png";
import { Heading, Image, SimpleGrid } from "@chakra-ui/react";
import styles from "../HomePage/Homepage.module.css";
import Card from "../../Components/Card";
import axios from "axios";
import Slider from "./Slider";

const Homepage = () => {
  const [homeData, setHomeData] = useState([]);

  const getHomeData = async () => {
    try {
      const res = await axios.get("https://mock-5yj5.onrender.com/products");
      setHomeData(res.data);
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
    
  };

  useEffect(() => {
    getHomeData();
  }, []);

  return (
    <>
      <Slider />
      <header className={styles.header}>
        <p>Top Categories to choose from</p>
        <Image alt="header2" src={header2} />
        <Image alt="header3" src={header3} />
        <Image alt="header4" src={header4} />
        <Image alt="headerlast" src={headerlast} />
      </header>

      <Heading p="10px">Products For You</Heading>
      <SimpleGrid
        w="100%"
        p={{ base: "2px", md: "3px", lg: "30px" }}
        margin="auto"
        gap={{ base: "0", md: "10px", lg: "15px" }}
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }}
      >
        {homeData.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Homepage;
