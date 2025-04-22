import React, { useEffect, useState, useRef } from 'react';
import { workshopFetch, workshopCheckIn } from '../api/AuthApi';       // API functions to fetch and check in
import { Workshop } from '../types/workshop';          // Workshop type definition
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

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  let html5QrcodeScanner: any = null;

  // Determine background color based on current color-mode
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await workshopFetch();
        if (Array.isArray(data)) {
          setWorkshops(data as Workshop[]);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        toast.error('Failed to fetch workshops. Please try again later.');
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Initialize or stop QR scanner when modal opens/closes
  useEffect(() => {
    let isMounted = true;
    if (scannerOpen && scannerRef.current) {
      // dynamically import to avoid SSR
      import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        if (!isMounted) return;
        html5QrcodeScanner = new Html5QrcodeScanner(
          scannerRef.current!.id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        html5QrcodeScanner.render(
          async (decodedText: string) => {
            if (selectedWorkshop) {
              try {
                await workshopCheckIn(selectedWorkshop.workshop_id, decodedText);
                toast.success('Check-in successful!');
              } catch (err) {
                toast.error('Check-in failed. Please try again.');
                console.error('Error checking in:', err);
              }
              html5QrcodeScanner.clear().catch(console.error);
              setScannerOpen(false);
              setSelectedWorkshop(null);
            }
          },
          (errorMessage: string) => {
            // optional error callback
            console.warn('QR scan error:', errorMessage);
          }
        );
      }).catch(err => {
        console.error('Failed to load html5-qrcode', err);
        toast.error('Could not load QR scanner.');
        setScannerOpen(false);
        setSelectedWorkshop(null);
      });
    }
    return () => {
      isMounted = false;
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(console.error);
      }
    };
  }, [scannerOpen, selectedWorkshop]);

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
        {workshops.map((workshop) => (
          <Box
            key={workshop.workshop_id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg={cardBg}
          >
            <Heading fontSize="xl">{workshop.title}</Heading>
            {workshop.date && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {new Date(workshop.date).toLocaleDateString()}
              </Text>
            )}
            <Text fontSize="sm" color="gray.500">
              Availability: {workshop.availability}
            </Text>
            <Button
              mt={3}
              colorScheme="teal"
              size="sm"
              onClick={() => {
                setSelectedWorkshop(workshop);
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
              <Box
                id="qr-scanner"
                ref={scannerRef}
                width="100%"
                height="auto"
              />
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