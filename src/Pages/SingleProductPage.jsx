import React, { useEffect, useState } from "react";
import { ArrowRightIcon, StarIcon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_SUCCESS } from "../Redux/Auth/auth.types";
import {
  HStack,
  VStack,
  Box,
  Image,
  Text,
  Grid,
  Button,
  useToast,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import Carousel from "better-react-carousel";

const SingleProductPage = () => {
  const [productData, setProductData] = useState({});
  const [userCartData, setUserCartData] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { image, title, price, rating, reviews } = productData;
  const userId = useSelector((state) => state.Auth.currentUser?.id);
  const isLoggedIn = useSelector((state) => state.Auth.isAuth);
  const toast = useToast();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const getSingleProductData = async (productId) => {
    try {
      const res = await fetch(`https://mock-5yj5.onrender.com/products/${productId}`);
      const data = await res.json();
      setProductData(data);

      // Fetch similar products
      const similarRes = await fetch(`https://mock-5yj5.onrender.com/products`);
      const similarData = await similarRes.json();
      // Get 4 random products
      const shuffled = similarData.sort(() => 0.5 - Math.random());
      setSimilarProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    if (userId) {
      try {
        const res = await fetch(`http://localhost:3000/login/${userId}`);
        const data = await res.json();
        setUserCartData(data.cart);
      } catch (error) {
        console.log(error);
      }
    } else {
      const localCartData = JSON.parse(localStorage.getItem("cart")) || [];
      setUserCartData(localCartData);
    }
  };

  const addToCart = async (navigateToCart = false) => {
    const newCartItem = {
      image,
      price,
      title,
      quantity: 1,
      orderId: Date.now(),
    };

    const updatedCart = [...userCartData, newCartItem];

    if (isLoggedIn && userId) {
      try {
        const res = await fetch(`http://localhost:3000/login/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: updatedCart }),
        });
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({ type: AUTH_SUCCESS, payload: data });
        setUserCartData(data.cart);
      } catch (error) {
        console.log(error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setUserCartData(updatedCart);
    }

    toast({
      position: "top",
      title: "Added to Cart",
      description: "Item added to your cart successfully",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    if (navigateToCart) {
      navigate("/cart");
    }
  };

  useEffect(() => {
    getSingleProductData(id);
    getUserData();
  }, [id]);
  useEffect(() => {
    getSingleProductData(id);
    getUserData();
    window.scrollTo(0, 0);  // Scroll to the top of the page
  }, [id]);

  return (
    <Grid
      templateRows={{
        sm: "repeat(2,auto)",
        md: "repeat(2,auto)",
        lg: "repeat(1,auto)",
      }}
      templateColumns={{
        sm: "repeat(1,auto)",
        md: "repeat(1,auto)",
        lg: "repeat(2,50%)",
      }}
      h="auto"
      w="100%"
      p={{ base: "30px 0px", md: "30px 0px", lg: "30px 100px" }}
      gap={"50px"}
      alignItems={"top"}
    >
      <Box h="auto">
        <HStack h="auto" gap="10px" alignItems={"top"}>
          

          <VStack
            border={"2px solid "}
            borderRadius="5px"
            h="90%"
            w="70%"
            gap="20px"
            marginLeft="60px"
            borderRadius="20px"
            box-shadow= "7.4px 14.7px 14.7px hsl(0deg 0% 0% / 0.27)"
          >
            <Carousel
              hideArrow
              showDots
              autoplay={2000}
              cols={1}
              rows={1}
              height={"400px"}
              box-shadow= "0px 10px 4px 5px rgba(0,0,0,0.1)"
              loop
            >
              {[image, image, image].map((img, idx) => (
                <Carousel.Item key={idx}>
                  <Image
                    h={{ base: "auto", md: "auto", lg: "400px" }}
                    src={img}
                    alt={`Product Image ${idx + 1}`}
                    width="100%"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </VStack>
        </HStack>
        <Grid
          w={{ base: "60%", md: "60%", lg: "80%" }}
          gap="5px"
          templateColumns={{
            base: "repeat(1,1fr)",
            md: "repeat(1,1fr)",
            lg: "repeat(2,1fr)",
          }}
          templateRows={{
            base: "repeat(2,60%)",
            md: "repeat(2,60%)",
            lg: "repeat(1,1fr)",
          }}
          m="auto"
          mt="20px"
          justifyContent={"space-around"}
        >
          <HStack
            p="7px 20px"
            fontSize="20px"
            borderRadius={"5px"}
            fontWeight={"600"}
            border="1px solid black"
            onClick={() => addToCart(false)}
            cursor="pointer"
          >
            <AiOutlineShoppingCart />
            <Text>Add to cart</Text>
          </HStack>
          <HStack
            p="7px 20px"
            borderRadius={"5px"}
            color="white"
            bgColor={"#9f2089"}
            fontSize="20px"
            fontWeight={"600"}
            onClick={() => addToCart(true)}
            cursor="pointer"
          >
            <ArrowRightIcon boxSize={"15px"} />
            <Text> Buy Now</Text>
          </HStack>
        </Grid>
      </Box>
      <VStack
        alignItems={{ base: "center", md: "center", lg: "left" }}
        gap="15px"
      >
        <VStack
          borderRadius={"5px"}
          border={"1px solid #dfdfdf"}
          h="auto"
          w="90%"
          p="15px"
          alignItems={"left"}
        >
          <Text
            textAlign={"left"}
            fontSize={"23px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            {title}
          </Text>
          <Text textAlign={"left"} fontSize={"30px"} fontWeight={"700"}>
            ₹{price}
          </Text>
          <Box
            color="#333"
            w="30%"
            ml="10px"
            bgColor="#f9f9f9"
            fontSize="14px"
            textAlign="center"
            borderRadius="15px"
            p="0px 5px"
          >
            Free Delivery
          </Box>
        </VStack>
        <VStack
          borderRadius={"5px"}
          border={"1px solid #dfdfdf"}
          h="auto"
          w="90%"
          p="15px"
          alignItems={"left"}
        >
          <Text textAlign={"left"} fontSize={"25px"} fontWeight={"500"}>
            Select Size
          </Text>
          <HStack mt="20px" fontWeight={"500"}>
            <Box borderRadius={"5px"} border="1px solid black" p="5px 10px">
              S
            </Box>
            <Box borderRadius={"5px"} border="1px solid black" p="5px 10px">
              M
            </Box>
            <Box borderRadius={"5px"} border="1px solid black" p="5px 10px">
              L
            </Box>
            <Box borderRadius={"5px"} border="1px solid black" p="5px 10px">
              XL
            </Box>
          </HStack>
        </VStack>
        <VStack
          borderRadius={"5px"}
          border={"1px solid #dfdfdf"}
          h="auto"
          w="90%"
          p="15px"
          alignItems={"left"}
        >
          <Text textAlign={"left"} fontSize={"25px"} fontWeight={"500"}>
            Product Details
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Name: {title}
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Fabric: Cotton Blend
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Sleeve Length: Short Sleeves
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Pattern: Printed
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Net Quantity (N): 1
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Sizes: S, M, L, XL
          </Text>
          <Text
            textAlign={"left"}
            fontSize={"19px"}
            color="#999"
            fontWeight={"500"}
            noOfLines={1}
          >
            Country of Origin: India
          </Text>
        </VStack>
        <VStack
          borderRadius={"10px"}
          border={"2px solid #dfdfdf"}
          h="auto"
          w="90%"
          p="15px"
          alignItems={"left"}
        >
          <Text textAlign={"left"} fontSize={"23px"} fontWeight={"500"}>
            Sold By
          </Text>
          <HStack justifyContent={"space-between"} p="10px">
            <Text textAlign={"left"} fontSize={"21px"} fontWeight={"500"}>
              S&D Fashion
            </Text>
            <Button
              border={"1px solid #f43397"}
              bgColor="white"
              color="#f43397"
            >
              View Shop
            </Button>
          </HStack>
          <HStack justifyContent={"space-around"} gap="10px">
            <VStack>
              <Box
                bgColor="#23BB75"
                p="3px 10px"
                ml="5px"
                color="white"
                fontWeight="bold"
                borderRadius="20px"
              >
                {rating}
                <StarIcon color="white" boxSize="10px" />
              </Box>
              <Text color="#718096" fontSize="20px" fontWeight="400">
                {reviews}
              </Text>
            </VStack>
            <VStack>
              <Text textAlign={"left"} fontSize={"25px"} fontWeight={"500"}>
                18792
              </Text>
              <Text
                textAlign={"left"}
                fontSize={"19px"}
                color="#999"
                fontWeight={"500"}
                noOfLines={1}
              >
                Followers
              </Text>
            </VStack>
            <VStack>
              <Text textAlign={"left"} fontSize={"25px"} fontWeight={"500"}>
                64
              </Text>
              <Text
                textAlign={"left"}
                fontSize={"19px"}
                color="#999"
                fontWeight={"500"}
                noOfLines={1}
              >
                Products
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack
          borderRadius={"5px"}
          border={"1px solid #dfdfdf"}
          h="auto"
          w="90%"
          bgColor={"#e7eeff"}
          p="20px"
        >
          <HStack justifyContent={"space-around"} gap="10px" w="100%">
            <HStack w="30%" alignItems={"center"} justifyContent="space-around">
              <Image
                w="25%"
                src="https://images.POP MUZAN.com/images/value_props/lowest_price_pbd.png"
              />
              <Text>Lowest Price</Text>
            </HStack>
            <HStack w="30%" alignItems={"center"} justifyContent="space-around">
              <Image
                w="25%"
                src="https://images.POP MUZAN.com/images/value_props/cash_on_delivery_pbd.png"
              />
              <Text>Cash on Delivery</Text>
            </HStack>
            <HStack w="30%" alignItems={"center"} justifyContent="space-around">
              <Image
                w="25%"
                src="https://images.POP MUZAN.com/images/value_props/7_day_returns_pbd.png"
              />
              <Text>7-day Returns</Text>
            </HStack>
          </HStack>
        </VStack>
        <VStack
          borderRadius={"20px"}
          border={"2px solid #dfdfdf"}
          h="auto"
          w="90%"
          p="15px"
        >
          <Text color="#999" fontWeight={"600"} fontSize="20px">
            People also viewed
          </Text>
        </VStack>
        <VStack
          borderRadius={"10px"}
          border={"2px solid #dfdfdf"}
          h="auto"
          w="auto%"
          p="15px"
        >
          <Text textAlign={"left"} fontSize={"23px"} fontWeight={"500"}>
            Products
          </Text>
          <SimpleGrid columns={{ base: 2, md: 1 }} spacing={10}>
            {similarProducts.map((product) => (
              <VStack
                key={product.id}
                h=""
                paddingLeft="10px"
                borderRadius="20px"
                p="10px 5px"
                boxShadow="rgba(0, 0, 1, 0.16) 5px 5px 8px"
                border="1px solid "
                alignItems="center"
                cursor="pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <Image w="80%" h="50%" margin="auto" src={product.image} />
                <Text>{product.title}</Text>
                <Text>₹{product.price}</Text>
                <Text color="#718096" fontSize="12px" fontWeight="400">
                  {product.reviews}
                </Text>
                <Box
                  bgColor="#23BB75"
                  p="3px 10px"
                  ml="5px"
                  color="white"
                  fontWeight="bold"
                  borderRadius="20px"
                >
                  {product.rating} <StarIcon color="white" boxSize="10px" />
                </Box>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </VStack>
    </Grid>
  );
};

export default SingleProductPage;
