import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { userRegistration } from '../api/AuthApi';
import FastQRScanner from '../components/FastQRScanner';
import {
  Box,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from '@chakra-ui/react';

const Home: NextPage = () => {
  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanStatus, setScanStatus] = useState<null | 'approved' | 'failed'>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScan = async (decodedText: string) => {
    try {
      await userRegistration(decodedText);
      toast.success('Registration successful!');
      setScanStatus('approved');
      setErrorMessage(null);
    } catch (err: any) {
      const message =
        typeof err === 'object' && err?.message
          ? err.message
          : 'Registration failed';
      toast.error(message);
      setScanStatus('failed');
      setErrorMessage(message);
    }

    // Reset state after 3 seconds
    setTimeout(() => {
      setScanStatus(null);
      setErrorMessage(null);
    }, 3000);
  };

  const toggleCamera = () => {
    setFacingMode((mode) => (mode === 'environment' ? 'user' : 'environment'));
  };

  const handleModalClose = () => {
    setScannerOpen(false);
    setScanStatus(null);
    setErrorMessage(null);
  };

  return (
    <>
      <Head>
        <title>Volunteer Management System</title>
        <meta name="description" content="Volunteer Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center className="min-h-screen bg-white px-4">
        <Button
          onClick={() => setScannerOpen(true)}
          width="100%"
          colorScheme="blue"
          py={2}
          rounded="md"
          _hover={{ bg: 'blue.600' }}
          transition="all 150ms"
        >
          Check Pax QR
        </Button>
      </Center>

      {/* Scanner Modal */}
      <Modal isOpen={scannerOpen} onClose={handleModalClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection="column">
              <Button onClick={toggleCamera} mb={4} colorScheme="blue" size="sm">
                Switch to {facingMode === 'environment' ? 'Front' : 'Back'} Camera
              </Button>
              <Box width="100%" minH="250px">
                <FastQRScanner
                  key={facingMode} // remount scanner on camera flip
                  onScan={handleScan}
                  facingMode={facingMode}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>

              {scanStatus && (
                <Text
                  mt={4}
                  fontSize="lg"
                  fontWeight="bold"
                  color={scanStatus === 'approved' ? 'green.400' : 'red.400'}
                >
                  {scanStatus === 'approved'
                    ? '✅ Registration Approved'
                    : '❌ Registration Failed'}
                </Text>
              )}

              {errorMessage && scanStatus === 'failed' && (
                <Text mt={2} fontSize="sm" color="red.500">
                  {errorMessage}
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
    </>
  );
};

export default Home;
