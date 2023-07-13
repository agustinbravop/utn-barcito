import {
  BoxProps,
  useColorModeValue,
  Box,
  Flex,
  CloseButton,
  Text,
  Icon,
  HStack,
  FlexProps,
  Image,
  Container,
  Badge,
  useMediaQuery,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BsCart2, BsTags } from "react-icons/bs";
import { PiPackage } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import { MdQueryStats } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const LINK_ITEMS = [
  { name: "Inicio", icon: FiHome, url: "/home" },
  { name: "Productos", icon: PiPackage, url: "/productos" },
  { name: "Ventas", icon: BsTags, url: "/ventas" },
  { name: "Compras", icon: BsCart2, url: "/compras" },
  { name: "Informes", icon: MdQueryStats, url: "/informes" },
];

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string | undefined;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "black",
        color: "white",
      }}
      {...rest}
    >
      {icon && <Icon mr="4" fontSize="16" as={icon} />}
      {children}
    </Flex>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const { currentUser, logout } = useCurrentUser();
  const navigate = useNavigate();
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <HStack h="20" marginLeft="8">
        <Image width="45px" src="/images/favicon.jpg" />
        <Container>
          <Text fontSize="2xl">El Barcito</Text>
          <Text fontSize="md">
            de <Badge colorScheme="orange">{currentUser}</Badge>
          </Text>
        </Container>
        {!isLargerThanMd && <CloseButton onClick={onClose} marginRight="8" />}
      </HStack>
      {LINK_ITEMS.map((link) => (
        <Link key={link.name} to={link.url} onClick={onClose}>
          <NavItem icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
      {currentUser && (
        <NavItem
          icon={BiLogOut}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Cerrar Sesión
        </NavItem>
      )}
    </Box>
  );
}
