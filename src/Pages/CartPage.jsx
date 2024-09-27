import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  HStack,
  Button,
  Text,
  Divider,
  Stack,
  Spinner,
  VStack,
  Show,
  useToast,
} from "@chakra-ui/react";
import CartItems from "../Components/CartItems";
import { Link } from "react-router-dom";
import axios from "axios";
import { AUTH_SUCCESS } from "../Redux/Auth/auth.types";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.Auth.currentUser?.id);
  const toast = useToast();

  const getUserData = async () => {
    setLoading(true);
    try {
      if (userId) {
        const response = await axios.get(`https://onestoredata.onrender.com/login/${userId}`);
        const userData = response.data;
        setCartData(userData.cart);
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: AUTH_SUCCESS, payload: userData });
      } else {
        const localCartData = JSON.parse(localStorage.getItem("cart")) || [];
        setCartData(localCartData);
      }
    } catch (error) {
      toast({
        title: "Error fetching user data.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocalCart = (newCartData) => {
    localStorage.setItem("cart", JSON.stringify(newCartData));
    setCartData(newCartData);
  };

  const handleDelete = async (orderId) => {
    const updatedCart = cartData.filter((item) => item.orderId !== orderId);
    if (userId) {
      try {
        await axios.patch(`https://onestoredata.onrender.com/login/${userId}`, {
          cart: updatedCart,
        });
        getUserData();
      } catch (error) {
        toast({
          title: "Error updating cart.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      updateLocalCart(updatedCart);
    }
  };

  const handleQuantityChange = async (orderId, num) => {
    const updatedCart = cartData.map((item) => {
      if (item.orderId === orderId) {
        return { ...item, quantity: item.quantity + num };
      }
      return item;
    });
    if (userId) {
      try {
        await axios.patch(`https://onestoredata.onrender.com/login/${userId}`, {
          cart: updatedCart,
        });
        getUserData();
      } catch (error) {
        toast({
          title: "Error updating cart.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      updateLocalCart(updatedCart);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const totalPrice = useMemo(() => {
    return cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartData]);

  return (
    <Box>
      <Stack direction={['column', 'row']} p="0px" w="100%" h="auto">
        <Box w={{ base: "100%", md: "50%", lg: "70%" }} h="auto" p="0px 30px">
          <HStack justifyContent={"space-between"} w="100%" borderBottom="1px solid #999" p="10px 30px" m="auto">
            <Text fontSize={{ base: "20px", md: "20px", lg: "25px" }} fontWeight="bold">Shopping Cart</Text>
            <Text fontSize={"20px"} fontWeight="bold">{cartData.length} Items</Text>
          </HStack>
          <Show above="sm">
            <HStack w="90%" h="50px" borderBottom={"1px solid #999"} justifyContent={"space-between"} m="auto">
              <Box w="40%" h="50%" fontWeight={600}>PRODUCT DETAILS</Box>
              <HStack w="50%" h="95%" p="20px 30px" fontWeight={600} justifyContent={"space-around"}>
                <Box>QUANTITY</Box>
                <Box>PRICE</Box>
              </HStack>
            </HStack>
          </Show>
          {loading ? (
            <VStack justifyContent="center" height="100vh">
              <Spinner size="xl" />
            </VStack>
          ) : (
            <Grid p={{ base: "0px", md: "0px", lg: "10px 40px" }} templateColumns={{ base: "repeat(1,100%)", md: "repeat(1,100%)", lg: "repeat(1,100%)" }} gap="20px">
              {cartData.map((item) => (
                <CartItems key={item.orderId} objProp={item} funcProp={handleDelete} funcquant={handleQuantityChange} />
              ))}
            </Grid>
          )}
        </Box>
        <Box h="500px" w={{ base: "100%", md: "50%", lg: "30%" }} bgColor={"#f5f5f6"} p="0px 30px">
          <HStack w="100%" borderBottom="1px solid #999" p="10px 20px" m="auto">
            <Text fontSize={"25px"} fontWeight="bold">Order Summary</Text>
          </HStack>
          <HStack w="100%" justifyContent={"space-between"} mt="20px" p="10px 10px" m="auto">
            <Text fontSize={"17px"} fontWeight="600">ITEMS {cartData.length}</Text>
            <Text fontSize={"17px"} fontWeight="600">₹{totalPrice}</Text>
          </HStack>
          <HStack w="100%" p="10px 10px" m="auto">
            <Text fontSize={"17px"} fontWeight="600">SHIPPING</Text>
          </HStack>
          
          <Button bgColor="pink.400" mt="20px" alignSelf={"left"} color="white">Apply</Button>
          <Divider mt="20px" />
          <HStack w="100%" justifyContent={"space-between"} mt="20px" p="10px 10px" m="auto">
            <Text fontSize={"17px"} fontWeight="600">TOTAL COST</Text>
            <Text fontSize={"17px"} fontWeight="600">₹{totalPrice}</Text>
          </HStack>
          <Link to={`/payment?total=${totalPrice}`}>
            <Button w="100%" bgColor="teal.500" color="white">CHECKOUT</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default CartPage;
