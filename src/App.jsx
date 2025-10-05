import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// 🌙 Переключатель темы
function ColorModeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    />
  );
}

function App() {
  // 📊 Состояние портфеля
  const [portfolioData, setPortfolioData] = useState([]);
  const [assets, setAssets] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAsset, setNewAsset] = useState({ name: "", quantity: "", price: "" });

  // ✅ Загружаем данные из localStorage при старте
  useEffect(() => {
    const savedAssets = localStorage.getItem("assets");
    const savedPortfolio = localStorage.getItem("portfolioData");

    if (savedAssets) setAssets(JSON.parse(savedAssets));
    else setAssets([
      { name: "AAPL", quantity: 10, price: 170 },
      { name: "TSLA", quantity: 5, price: 740 },
      { name: "GOOGL", quantity: 2, price: 2800 },
    ]);

    if (savedPortfolio) setPortfolioData(JSON.parse(savedPortfolio));
    else setPortfolioData([
      { date: "01-10", value: 1000 },
      { date: "02-10", value: 1050 },
      { date: "03-10", value: 1020 },
      { date: "04-10", value: 1080 },
      { date: "05-10", value: 1150 },
    ]);
  }, []);

  // 💾 Сохраняем изменения в localStorage
  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  }, [portfolioData]);

  // ➕ Добавление нового актива
  const handleAddAsset = () => {
    if (newAsset.name && newAsset.quantity && newAsset.price) {
      const assetObj = {
        name: newAsset.name,
        quantity: Number(newAsset.quantity),
        price: Number(newAsset.price),
      };
      setAssets([...assets, assetObj]);

      const lastValue =
        portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : 0;

      setPortfolioData([
        ...portfolioData,
        {
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          }),
          value: lastValue + assetObj.quantity * assetObj.price,
        },
      ]);

      setNewAsset({ name: "", quantity: "", price: "" });
      onClose();
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={5}>
      <HStack mb={5}>
        <Heading>📈 Инвестиционный портфель</Heading>
        <Spacer />
        <ColorModeSwitcher />
      </HStack>

      {/* 📊 График динамики */}
      <Box
        bg="whiteAlpha.900"
        _dark={{ bg: "gray.700" }}
        p={5}
        borderRadius="md"
        shadow="md"
        mb={5}
      >
        <Text fontWeight="bold" mb={2}>
          Динамика портфеля
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={portfolioData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3182CE" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 📋 Список активов */}
      <HStack mb={3}>
        <Heading size="md">Активы</Heading>
        <Spacer />
        <Button colorScheme="teal" onClick={onOpen}>
          Добавить актив
        </Button>
      </HStack>

      <SimpleGrid columns={[1, 2, 3]} spacing={5}>
        {assets.map((asset, index) => (
          <Box
            key={index}
            bg="whiteAlpha.900"
            _dark={{ bg: "gray.700" }}
            p={5}
            borderRadius="md"
            shadow="md"
          >
            <VStack align="start">
              <Heading size="md">{asset.name}</Heading>
              <HStack w="100%">
                <Text>Кол-во: {asset.quantity}</Text>
                <Spacer />
                <Text>Цена: ${asset.price}</Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* 🆕 Модальное окно добавления */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить новый актив</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Название актива</FormLabel>
              <Input
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                placeholder="AAPL"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Количество</FormLabel>
              <Input
                type="number"
                value={newAsset.quantity}
                onChange={(e) => setNewAsset({ ...newAsset, quantity: e.target.value })}
                placeholder="10"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Цена</FormLabel>
              <Input
                type="number"
                value={newAsset.price}
                onChange={(e) => setNewAsset({ ...newAsset, price: e.target.value })}
                placeholder="170"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddAsset}>
              Добавить
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;




