import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_SUCCESS } from "../Redux/Auth/auth.types";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Text, HStack, VStack, Input, Select, Button, useToast, Stack, Image, FormControl, FormLabel
} from "@chakra-ui/react";
import { FaAddressCard } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import * as Yup from "yup";
import { useFormik } from 'formik';

const PaymentPage = () => {
  const [upiDetails, setUpiDetails] = useState({ upiId: "" });
  const userId = useSelector((state) => state.Auth.currentUser.id);
  const cartItems = useSelector((state) => state.Auth.currentUser.cart);
  const total = useSelector((state) => state.productReducer.totalPrice);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const totalPrice = params.get("total");
  const [page, setPage] = useState(false);
  const [pay, setPay] = useState("");
  const toast = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/upiDetails.json")
      .then(response => response.json())
      .then(data => setUpiDetails(data))
      .catch(error => console.error('Error fetching UPI details:', error));
  }, []);

  const LoginSchema = Yup.object({
    email: Yup.string().email().required("Please Enter Your Email"),
    name: Yup.string().min(2).required("Please Enter Your Name"),
    address: Yup.string().min(2).required("Please Enter Your Address"),
    city: Yup.string().min(2).required("Please Enter Your City"),
    zip: Yup.number().min(6).required("Please Enter Your Zipcode"),
    cardHolderName: Yup.string().min(2).required("Please Enter Your Card Holder Name"),
    cardNumber: Yup.number().min(16).required("Please Enter Your Card Number"),
    cvv: Yup.number().min(3).required("Enter CVV"),
  });

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: { name: "", email: "", address: "", city: "", zip: "", cardHolderName: "", cardNumber: "", cvv: "" },
    validationSchema: LoginSchema,
    onSubmit: (values, action) => {
      handlePayment();
      action.resetForm();
    }
  });

  const cartDetails = async () => {
    try {
      let r = await fetch(`http://localhost:3000/login/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          cart: [],
          order: [...cartItems],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let d = await r.json();
      localStorage.setItem("user", JSON.stringify(d));
      dispatch({ type: AUTH_SUCCESS, payload: d });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = () => {
    toast({
      position: "top",
      title: 'Payment Successful',
      description: "Thank You for Shopping",
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
    cartDetails();
    navigate("/order");
  };

  const generateUPILink = (amount) => {
    return `phonepe://pay?pa=${upiDetails.upiId}&am=${amount}&pn=flipkart&mc=8999&cu=INR&tn=CUST2141782633&sign=AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr`;
  };

  return (
    <Box mt="30px" mb="30px">
      <HStack w={{ base: "60%", md: "60%", lg: "20%" }} m="auto" gap="0px">
        <Box h="50px" w="80px" border="3px solid teal" borderRadius={"20px"} onClick={() => setPage(false)}>
          <FaAddressCard style={{ margin: "auto", marginTop: "15%" }} color="teal" size="30px" />
        </Box>
        <Box w="70%" border="1px solid" borderColor={page ? "teal" : "gray.300"}></Box>
        <Box h="50px" w="80px" border="3px solid" borderColor={page ? "teal" : "gray.300"} onClick={() => setPage(true)} borderRadius={"20px"}>
          <MdPayment style={{ margin: "auto", marginTop: "15%" }} color={page ? "teal" : "gray"} size="30px" />
        </Box>
      </HStack>
      <HStack w={{ base: "60%", md: "60%", lg: "20%" }} m="auto" justifyContent={"space-between"} fontWeight={"600"}>
        <Text color="teal.500">Address</Text>
        <Text color={page ? "teal.500" : "gray"}>Payment</Text>
      </HStack>
      {page ?
        <Stack direction={{ base: "column", md: "column", lg: "row" }} w={{ base: "95%", md: "90%", lg: "60%" }} m="auto" mt="30px">
          <VStack w={{ base: "100%", md: "100%", lg: "45%" }}>
            <VStack w="100%" h="auto" bgColor="pink.400" mt="20px" alignItems={"center"} borderRadius="20px">
              <Text mt="20px" fontSize={"18px"} color="white">Total to pay</Text>
              <Text fontSize={"35px"} fontWeight="bold" color="white">₹{totalPrice}</Text>
            </VStack>
            <Box p="20px 0px" w="100%">
              <Text fontWeight={"600"} color="#999">How would you like to pay?</Text>
              <VStack alignItems={"center"} p="30px 0px" w="100%">
                <HStack border="2px solid black" p="0px 10px" gap="10px" borderRadius="20px" fontWeight={"600"} h="55px" w="80%" alignItems={"center"}>
                  <Box w="40%">UPI</Box>
                  <HStack w="60%" h="60%" alignItems={"center"}>
                    <Box w="30%" h="100%" border={pay === "phonepe" ? "2px solid teal" : ""} onClick={() => setPay("phonepe")}>
                      <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX1y9bRtwN4tkv5dwh33YdbbnJIBj-PRHmWg&s" h="100%"></Image>
                    </Box>
                    <Box w="30%" h="100%" border={pay === "gpay" ? "2px solid teal" : ""} onClick={() => setPay("gpay")}>
                      <Image src="https://pay.google.com/about/static_kcs/images/logos/footer-logo.svg" h="100%"></Image>
                    </Box>
                    <Box w="30%" h="100%" border={pay === "paytm" ? "2px solid teal" : ""} onClick={() => setPay("paytm")}>
                      <Image src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg" h="100%"></Image>
                    </Box>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </VStack>

          <VStack w={{ base: "100%", md: "100%", lg: "55%" }} m="auto" mt="30px" p="20px" borderRadius={"10px"} boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px">
          <Box w="30%" h="100%" border={pay === "phonepe" ? "2px solid teal" : ""} onClick={() => setPay("phonepe")}>
                      <Image src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxMzIgNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZT4uc3Qwe2ZpbGw6IzVmMjU5Zn08L3N0eWxlPjxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoLTc2LjcxNCAxNy44NyAyNC4wMDEpIiBjbGFzcz0ic3QwIiBjeD0iMTcuOSIgY3k9IjI0IiByPSIxNy45Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTkwLjUgMzQuMnYtNi41YzAtMS42LS42LTIuNC0yLjEtMi40LS42IDAtMS4zLjEtMS43LjJWMzVjMCAuMy0uMy42LS42LjZoLTIuM2MtLjMgMC0uNi0uMy0uNi0uNlYyMy45YzAtLjQuMy0uNy42LS44IDEuNS0uNSAzLS44IDQuNi0uOCAzLjYgMCA1LjYgMS45IDUuNiA1LjR2Ny40YzAgLjMtLjMuNi0uNi42SDkyYy0uOSAwLTEuNS0uNy0xLjUtMS41em05LTMuOWwtLjEuOWMwIDEuMi44IDEuOSAyLjEgMS45IDEgMCAxLjktLjMgMi45LS44LjEgMCAuMi0uMS4zLS4xLjIgMCAuMy4xLjQuMi4xLjEuMy40LjMuNC4yLjMuNC43LjQgMSAwIC41LS4zIDEtLjcgMS4yLTEuMS42LTIuNC45LTMuOC45LTEuNiAwLTIuOS0uNC0zLjktMS4yLTEtLjktMS42LTIuMS0xLjYtMy42di0zLjljMC0zLjEgMi01IDUuNC01IDMuMyAwIDUuMiAxLjggNS4yIDV2Mi40YzAgLjMtLjMuNi0uNi42aC02LjN6bS0uMS0yLjJIMTAzLjJ2LTFjMC0xLjItLjctMi0xLjktMnMtMS45LjctMS45IDJ2MXptMjUuNSAyLjJsLS4xLjljMCAxLjIuOCAxLjkgMi4xIDEuOSAxIDAgMS45LS4zIDIuOS0uOC4xIDAgLjItLjEuMy0uMS4yIDAgLjMuMS40LjIuMS4xLjMuNC4zLjQuMi4zLjQuNy40IDEgMCAuNS0uMyAxLS43IDEuMi0xLjEuNi0yLjQuOS0zLjguOS0xLjYgMC0yLjktLjQtMy45LTEuMi0xLS45LTEuNi0yLjEtMS42LTMuNnYtMy45YzAtMy4xIDItNSA1LjQtNSAzLjMgMCA1LjIgMS44IDUuMiA1djIuNGMwIC4zLS4zLjYtLjYuNmgtNi4zem0tLjEtMi4ySDEyOC42di0xYzAtMS4yLS43LTItMS45LTJzLTEuOS43LTEuOSAydjF6TTY2IDM1LjdoMS40Yy4zIDAgLjYtLjMuNi0uNnYtNy40YzAtMy40LTEuOC01LjQtNC44LTUuNC0uOSAwLTEuOS4yLTIuNS40VjE5YzAtLjgtLjctMS41LTEuNS0xLjVoLTEuNGMtLjMgMC0uNi4zLS42LjZ2MTdjMCAuMy4zLjYuNi42aDIuM2MuMyAwIC42LS4zLjYtLjZ2LTkuNGMuNS0uMiAxLjItLjMgMS43LS4zIDEuNSAwIDIuMS43IDIuMSAyLjR2Ni41Yy4xLjcuNyAxLjQgMS41IDEuNHptMTUuMS04LjRWMzFjMCAzLjEtMi4xIDUtNS42IDUtMy40IDAtNS42LTEuOS01LjYtNXYtMy43YzAtMy4xIDIuMS01IDUuNi01IDMuNSAwIDUuNiAxLjkgNS42IDV6bS0zLjUgMGMwLTEuMi0uNy0yLTItMnMtMiAuNy0yIDJWMzFjMCAxLjIuNyAxLjkgMiAxLjlzMi0uNyAyLTEuOXYtMy43em0tMjIuMy0xLjdjMCAzLjItMi40IDUuNC01LjYgNS40LS44IDAtMS41LS4xLTIuMi0uNHY0LjVjMCAuMy0uMy42LS42LjZoLTIuM2MtLjMgMC0uNi0uMy0uNi0uNlYxOS4yYzAtLjQuMy0uNy42LS44IDEuNS0uNSAzLS44IDQuNi0uOCAzLjYgMCA2LjEgMi4yIDYuMSA1LjZ2Mi40ek01MS43IDIzYzAtMS42LTEuMS0yLjQtMi42LTIuNC0uOSAwLTEuNS4zLTEuNS4zdjYuNmMuNi4zLjkuNCAxLjYuNCAxLjUgMCAyLjYtLjkgMi42LTIuNFYyM3ptNjguMiAyLjZjMCAzLjItMi40IDUuNC01LjYgNS40LS44IDAtMS41LS4xLTIuMi0uNHY0LjVjMCAuMy0uMy42LS42LjZoLTIuM2MtLjMgMC0uNi0uMy0uNi0uNlYxOS4yYzAtLjQuMy0uNy42LS44IDEuNS0uNSAzLS44IDQuNi0uOCAzLjYgMCA2LjEgMi4yIDYuMSA1LjZ2Mi40em0tMy42LTIuNmMwLTEuNi0xLjEtMi40LTIuNi0yLjQtLjkgMC0xLjUuMy0xLjUuM3Y2LjZjLjYuMy45LjQgMS42LjQgMS41IDAgMi42LS45IDIuNi0yLjRWMjN6Ii8+PHBhdGggZD0iTTI2IDE5LjNjMC0uNy0uNi0xLjMtMS4zLTEuM2gtMi40bC01LjUtNi4zYy0uNS0uNi0xLjMtLjgtMi4xLS42bC0xLjkuNmMtLjMuMS0uNC41LS4yLjdsNiA1LjdIOS41Yy0uMyAwLS41LjItLjUuNXYxYzAgLjcuNiAxLjMgMS4zIDEuM2gxLjR2NC44YzAgMy42IDEuOSA1LjcgNS4xIDUuNyAxIDAgMS44LS4xIDIuOC0uNXYzLjJjMCAuOS43IDEuNiAxLjYgMS42aDEuNGMuMyAwIC42LS4zLjYtLjZWMjAuOGgyLjNjLjMgMCAuNS0uMi41LS41di0xem0tNi40IDguNmMtLjYuMy0xLjQuNC0yIC40LTEuNiAwLTIuNC0uOC0yLjQtMi42di00LjhoNC40djd6IiBmaWxsPSIjZmZmIi8+PC9zdmc+" h="100%"></Image>
                    </Box>
                    <Box w="30%" h="100%" border={pay === "gpay" ? "2px solid teal" : ""} onClick={() => setPay("gpay")}>
                      <Image src="https://pay.google.com/about/static_kcs/images/logos/footer-logo.svg" h="100%"></Image>
                    </Box>
                    <Box w="30%" h="100%" border={pay === "paytm" ? "2px solid teal" : ""} onClick={() => setPay("paytm")}>
                      <Image src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg" h="100%"></Image>
                    </Box>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>

              <Button type="submit" alignSelf="left" mt="30px" p="20px" bgColor={"pink.600"} color="white" _hover={{ color: "pink.500", bgColor: "white" }}>
                <a href={generateUPILink(totalPrice)} target="_blank" rel="noopener noreferrer">Pay Now ₹{totalPrice}</a>
              </Button>
            </form>
          </VStack>
        </Stack>
        :
        <VStack w={{ base: "95%", md: "80%", lg: "30%" }} m="auto" p="20px" mt="30px" borderRadius={"10px"} boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px">
          <FormControl as="fieldset" spacing="24px">
            <FormLabel as="legend" fontWeight={600}>Full Name</FormLabel>
            <Input type="name" placeholder="Full name" name="name" value={values.name} onChange={handleChange} border="1px solid teal" />
            {errors.name && touched.name && <Text textAlign={"left"} fontSize={"14px"} color="red">{errors.name}</Text>}
            <FormLabel as="legend" fontWeight={600} mt="10px">Email</FormLabel>
            <Input type="email" placeholder="Eg:- abhi123@gmail.com" name="email" value={values.email} onChange={handleChange} border="1px solid teal" />
            {errors.email && touched.email && <Text textAlign={"left"} fontSize={"14px"} color="red">{errors.email}</Text>}
            <FormLabel as="legend" fontWeight={600} mt="10px">Address</FormLabel>
            <Input type="text" placeholder="Enter Your Full Address" border="1px solid teal" name="address" value={values.address} onChange={handleChange} />
            {errors.address && touched.address && <Text textAlign={"left"} fontSize={"14px"} color="red">{errors.address}</Text>}
            <FormLabel as="legend" fontWeight={600} mt="10px">City</FormLabel>
            <Input type="text" placeholder="Eg:- Mumbai" border="1px solid teal" name="city" value={values.city} onChange={handleChange} />
            {errors.city && touched.city && <Text textAlign={"left"} fontSize={"14px"} color="red">{errors.city}</Text>}
            <HStack w="100%">
              <VStack w="50%" alignItems={"left"}>
                <FormLabel as="legend" fontWeight={600} mt="10px">State</FormLabel>
                <Select placeholder="Select State" border="1px solid teal">
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Goa">Goa</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </Select>
              </VStack>
              <VStack w="50%" alignItems={"left"}>
                <FormLabel as="legend" fontWeight={600} mt="10px">Zip code</FormLabel>
                <Input type="text" placeholder="Eg:- 400009" border="1px solid teal" name="zip" value={values.zip} onChange={handleChange} />
                {errors.zip && touched.zip && <Text textAlign={"left"} fontSize={"14px"} color="red">{errors.zip}</Text>}
              </VStack>
            </HStack>
            <Button alignSelf="left" mt="30px" p="20px" bgColor={"pink.600"} color="white" _hover={{ color: "pink.500", bgColor: "white" }} onClick={() => setPage(true)}>
              Next
            </Button>
          </FormControl>
        </VStack>}
    </Box>
  );
};

export default PaymentPage;
