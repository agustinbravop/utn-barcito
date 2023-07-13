import { VStack, Heading, Button, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

export interface CardElementProps {
  title: string;
  desc: string[];
  icon: IconType;
  url: string;
}

function CardElement({ title, desc, icon, url }: CardElementProps) {
  return (
    <Link to={url}>
      <Button
        variant="outline"
        colorScheme="green"
        height="150px"
        width="200px"
      >
        <VStack spacing="20px">
          <Icon as={icon} fontSize="50px" />
          <Heading size="lg">{title}</Heading>
        </VStack>
      </Button>
    </Link>
  );
}

export default CardElement;

/* VERSION ANTERIOR
<Card maxW="14rem" margin="3" width="100%">
      <CardHeader textAlign="center" padding="20px 0px 20px 0px">
        <Link to={url}>
          <Button
            leftIcon={<Icon as={icon} />}
            variant="outline"
            colorScheme="green"
          >
            <Heading size="md">{title}</Heading>
          </Button>
        </Link>
      </CardHeader>
      <CardBody paddingTop="0px" visibility={{ base: "hidden", sm: "initial" }}>
        <VStack spacing="2" minH={{ base: "0px", sm: "120px" }}>
          {desc.map((str) => (
            <Text width="100%">- {str}</Text>
          ))}
        </VStack>
      </CardBody>
    </Card> */
