// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import QRScanner from '../components/qr-scanner'
import { useRouter } from 'next/router'
import { userRegistration } from '../api/AuthApi'
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
} from '@chakra-ui/react'

const Home: NextPage = () => {
  const router = useRouter()
  const [scannerOpen, setScannerOpen] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment'
  )

  const handleScan = async (decodedText: string) => {
    try {
      // Attempt user registration with scanned QR code
      await userRegistration(decodedText)
      toast.success(`Registration successful!`)
      setScannerOpen(false)
      router.push('/success')
    } catch (err) {
      console.error('Registration failed', err)
      toast.error('Registration failed')
      setScannerOpen(false)
      router.push({
        pathname: '/failure',
        query: { message: (err as Error).message || 'An unknown error occurred' },
      });
    }
  }

  

  const toggleCamera = () => {
    setFacingMode((mode) =>
      mode === 'environment' ? 'user' : 'environment'
    )
  }

  return (
    <>
      <Head>
        <title>Volunteer Management System</title>
        <meta name="description" content="Volunteer Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Full‑screen light bg with centered card */}
      <Center className="min-h-screen bg-white px-4">
        <Button
          onClick={() => setScannerOpen(true)}
          width="100%"
          colorScheme="blue"
          py={2}
          rounded="md"
          _hover={{ bg: "blue.600" }}
          transition="all 150ms"
        >
          Check Pax QR
        </Button>
      </Center>

      {/* Scanner Modal */}
      {scannerOpen && (
        <Modal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} isCentered>
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
                  <QRScanner
                    key={facingMode} // force remount when facingMode flips
                    onScan={handleScan}
                    facingMode={facingMode}
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
      )}
    </>
  );
};

export default Home;
