import React from "react";
import {
  MenuButton,
  MenuList,
  MenuGroup,
  VStack,
  Text,
  
  Flex,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
const Authbuttons = () => {
  return (
    <>
      
      <MenuButton >
       
      
      <Flex direction="column" w={{base:"30px",md:"40px",lg:'80px'}} alignItems="center">
      <BsPerson fontSize="30px" />
  
             <Text display={{base:"none",md:"none",lg:"block"}}>Profile</Text>
                </Flex>
      </MenuButton>
      <MenuList pb="10px" >
        <MenuGroup title="Hello User" fontSize="19px" textAlign="left">
          <VStack>
            <Text fontSize="13px" textAlign="left">
              To access your POP MUZAN account
            </Text>

            
            
            
          </VStack>
        </MenuGroup>
      </MenuList>
    </>
  );
};

export default Authbuttons;
