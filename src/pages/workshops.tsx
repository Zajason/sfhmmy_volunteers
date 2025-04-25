import React, { useEffect, useState } from 'react';
import { workshopFetch, workshopCheckIn } from '../api/AuthApi';
import { Workshop } from '../types/workshop';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Stack,
  Center,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import QRScanner from '../components/FastQRScanner'; // using your optimized QR scanner

const Workshops: React.FC = () => {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [scannerFacing, setScannerFacing] = useState<'environment' | 'user'>('environment');
  const [scanStatus, setScanStatus] = useState<null | 'approved' | 'failed'>(null);

  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    (async () => {
      try {
        const data = await workshopFetch();
        if (!Array.isArray(data)) throw new Error('Invalid format');
        setWorkshops(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch workshops.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleScan = async (decodedText: string) => {
    if (!selectedWorkshop) return;

    try {
      const result = await workshopCheckIn(selectedWorkshop.workshop_id, decodedText);
      toast.success(result.message);
      setScanStatus('approved');
    } catch (err) {
      console.error('Check‑in failed', err);
      toast.error('Check‑in failed');
      setScanStatus('failed');
    }

    // Reset status after 2 seconds to allow next scan
    setTimeout(() => {
      setScanStatus(null);
    }, 4000);
  };

  const toggleCamera = () => {
    setScannerFacing(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleModalClose = () => {
    setScannerOpen(false);
    setSelectedWorkshop(null);
    setScanStatus(null);
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6} maxW="container.lg" mx="auto">
      <Heading mb={6}>Upcoming Workshops</Heading>
      <Stack spacing={4}>
        {workshops.map(w => (
          <Box
            key={w.workshop_id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg={cardBg}
          >
            <Heading fontSize="xl">{w.title}</Heading>
            {w.date && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {new Date(w.date).toLocaleDateString()}
              </Text>
            )}
            <Text fontSize="sm" color="gray.500">
              Availability: {w.availability}
            </Text>
            <Button
              mt={3}
              colorScheme="teal"
              size="sm"
              onClick={() => {
                setSelectedWorkshop(w);
                setScannerOpen(true);
              }}
            >
              Scan QR Code
            </Button>
          </Box>
        ))}
      </Stack>

      {/* QR Scanner Modal */}
      <Modal isOpen={scannerOpen} onClose={handleModalClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection="column">
              <Button onClick={toggleCamera} mb={4} colorScheme="blue" size="sm">
                Switch to {scannerFacing === 'environment' ? 'Front' : 'Back'} Camera
              </Button>
              <Box width="100%" minH="250px">
                <QRScanner
                  onScan={handleScan}
                  facingMode={scannerFacing}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
              {scanStatus && (
                <Text mt={4} fontSize="lg" fontWeight="bold" color={scanStatus === 'approved' ? 'green.400' : 'red.400'}>
                  {scanStatus === 'approved' ? '✅ Approved' : '❌ Failed'}
                </Text>
              )}
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={handleModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Workshops;
