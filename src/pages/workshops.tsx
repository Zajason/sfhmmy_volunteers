// components/Workshops.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // ← add this import
import { workshopFetch, workshopCheckIn } from '../api/AuthApi';
import { Workshop } from '../types/workshop';
import { toast } from 'react-toastify';
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
import QRScanner from '../components/qr-scanner'; // ← import your TSX scanner

const Workshops: React.FC = () => {
  const router = useRouter(); // ← initialize the router
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

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
      await workshopCheckIn(selectedWorkshop.workshop_id, decodedText);
      toast.success('Check‑in successful!');
      router.push('/success'); // redirect on success
    } catch (err) {
      console.error(err);
      toast.error('Check‑in failed.');
      router.push('/failure'); // redirect on failure
    } finally {
      setScannerOpen(false);
      setSelectedWorkshop(null);
    }
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
      <Modal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Box width="100%" minH="250px">
                <QRScanner
                  onScan={handleScan}
                  facingMode="environment"
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setScannerOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Workshops;
