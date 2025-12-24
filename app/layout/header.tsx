'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Badge } from '@mui/material';
import { Medication, ShoppingCart, Menu } from '@mui/icons-material';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="sticky"
      className={`transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg py-2'
          : 'bg-white/85 backdrop-blur-md shadow-md py-4'
      }`}
      sx={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: scrolled
          ? '0 5px 20px rgba(0, 0, 0, 0.1)'
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar className="container mx-auto px-4">
        <Link href="/" className="flex items-center text-blue-600 font-extrabold text-2xl tracking-tight">
          <Medication className="mr-2 text-cyan-400" />
          PharmaFind
        </Link>
        <Box className="flex-1" />
        <Box className="hidden md:flex items-center space-x-2">
          <Button
            component={Link}
            href="/routes/orders"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            My Orders
          </Button>
          <Button
            component={Link}
            href="/routes/medicines"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            Medicines
          </Button>
          <Button
            component={Link}
            href="/#latest-medicines"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            New Arrivals
          </Button>
          <Button
            component={Link}
            href="/#offers"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            Offers
          </Button>
          <Button
            component={Link}
            href="/#blog"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            Blog
          </Button>
          <Button
            component={Link}
            href="/#contact"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            Contact
          </Button>
          <Button
            component={Link}
            href="/admin/dashboard"
            className="text-gray-700 font-semibold px-4 py-2 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-3/4"
          >
            Admin
          </Button>
          <IconButton component={Link} href="/routes/cart" sx={{ color: '#374151', '&:hover': { color: '#2563eb' } }} className="ml-2">
            <Badge badgeContent={getTotalItems()} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: 'block', md: 'none' }, color: '#374151' }}
        >
          <Menu />
        </IconButton>
      </Toolbar>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="md:hidden"
      >
        <Box className="w-64 py-4">
          <Box className="px-4 pb-4 border-b border-gray-200">
            <Link href="/" className="flex items-center text-blue-600 font-extrabold text-xl tracking-tight" onClick={() => setDrawerOpen(false)}>
              <Medication className="mr-2 text-cyan-400" />
              PharmaFind
            </Link>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/routes/orders" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="My Orders" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/routes/medicines" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Medicines" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/#latest-medicines" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="New Arrivals" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/#offers" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Offers" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/#blog" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Blog" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/#contact" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/admin/dashboard" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/routes/cart" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <Badge badgeContent={getTotalItems()} color="primary">
                    <ShoppingCart />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={`Cart ${getTotalItems() > 0 ? `(${getTotalItems()})` : ''}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;