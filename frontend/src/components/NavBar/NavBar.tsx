import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MobileNav } from "./MobileNav";
import { SidebarContent } from "./SidebarContent";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useEffect } from "react";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === undefined) {
      navigate("/login");
    }
  }, [navigate, currentUser]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" pt="12">
        <Outlet />
      </Box>
    </Box>
  );
}
