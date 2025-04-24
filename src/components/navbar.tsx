import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
    const router = useRouter();

    const handleTabsChange = (index: number) => {
        if (index === 1) { // Workshop Check tab
            router.push('/workshops');
        }
        else if (index === 2) { // Logout tab
            router.push('/logout');
        }
        else if (index === 0) { // Registration Check tab
            router.push('/');
        }
    };

    return (
        <Tabs onChange={handleTabsChange}>
            <TabList>
                <Tab>Registration Check</Tab>
                <Tab>Workshop Check</Tab>
                <Tab>Logout</Tab>
            </TabList>

           
        </Tabs>
    );
};

export default Navbar;