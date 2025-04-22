"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Heading,
  Container,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import {
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/form-control';
import { useToast } from '@chakra-ui/toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './styles.module.css';

type FormData = {
  date: Date;
  marketContext: string;
  marketContextNotes: string;
  nearestMCVPOC1: string;
  nearestMCVPOC2: string;
  yVPOC: string;
  NVPOCs: string;
  ONH: string;
  ONL: string;
  ONMID: string;
  ONVPOC: string;
};

const TradingPlanForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date(),
    marketContext: '',
    marketContextNotes: '',
    nearestMCVPOC1: '',
    nearestMCVPOC2: '',
    yVPOC: '',
    NVPOCs: '',
    ONH: '',
    ONL: '',
    ONMID: '',
    ONVPOC: '',
  });

  const toast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, date });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/plans', formData);
      console.log('Trade Plan Saved:', response.data);
      toast({
        title: 'Trade plan saved!',
        description: 'Your daily trade plan has been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error saving trade plan:', err);
      toast({
        title: 'Error',
        description: 'There was an error saving your trade plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container className={styles.tradePlanFormContainer} maxW="container.sm" py={8}>
      <Heading mb={6}>Daily Trading Plan</Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        borderWidth="1px"
        p={6}
        borderRadius="md"
        boxShadow="lg"
      >
        <VStack gap={4} align="flex-start">
          {/* Date Field with DatePicker */}
          <FormControl id="date" isRequired>
            <FormLabel>Date</FormLabel>
            <DatePicker
              selected={formData.date}
              onChange={(date: Date | null) => date && handleDateChange(date)}
              dateFormat="MMMM d, yyyy"
              className="chakra-input"
            />
            <FormHelperText>Select the date of the trade</FormHelperText>
          </FormControl>

          {/* Market Context Dropdown */}
          <FormControl id="marketContext" isRequired>
            <FormLabel>Market Context</FormLabel>
            <Select
              name="marketContext"
              value={formData.marketContext}
              onChange={handleSelectChange}
            >
              <option value="">Select Market Context</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="sideways">Sideways</option>
              <option value="sideways">Sideways Lean Up</option>
              <option value="sideways">Sideways Lean Down</option>
              <option value="trending">Trending</option>
            </Select>
          </FormControl>

          {/* Market Context Notes */}
          <FormControl id="marketContextNotes">
            <FormLabel>Market Context Notes</FormLabel>
            <Textarea
              className={styles.input}
              name="marketContextNotes"
              value={formData.marketContextNotes}
              onChange={handleChange}
              placeholder="Provide any additional context for the market"
            />
          </FormControl>

          {/* Key Levels Section */}
          <Heading size="md" mt={4}>Key Levels</Heading>
          <FormControl id="nearestMCVPOC1" isRequired>
            <FormLabel>Nearest MCVPOC Level 1</FormLabel>
            <Input
              className={styles.input}
              name="nearestMCVPOC1"
              value={formData.nearestMCVPOC1}
              onChange={handleChange}
              placeholder="Enter the nearest MCVPOC level 1"
            />
          </FormControl>
          <FormControl id="nearestMCVPOC2" isRequired>
            <FormLabel>Nearest MCVPOC Level 2</FormLabel>
            <Input
              className={styles.input}
              name="nearestMCVPOC2"
              value={formData.nearestMCVPOC2}
              onChange={handleChange}
              placeholder="Enter the nearest MCVPOC level 2"
            />
          </FormControl>
          <FormControl id="yVPOC" isRequired>
            <FormLabel>yVPOC</FormLabel>
            <Input
              className={styles.input}
              name="yVPOC"
              value={formData.yVPOC}
              onChange={handleChange}
              placeholder="Enter the yVPOC level"
            />
          </FormControl>
          <FormControl id="NVPOCs" isRequired>
            <FormLabel>NVPOCs</FormLabel>
            <Input
              className={styles.input}
              name="NVPOCs"
              value={formData.NVPOCs}
              onChange={handleChange}
              placeholder="Enter the NVPOC levels"
            />
          </FormControl>

          {/* Overnight Levels Section */}
          <Heading size="md" mt={4}>Overnight Levels</Heading>
          <FormControl id="ONH" isRequired>
            <FormLabel>ONH</FormLabel>
            <Input
              className={styles.input}
              name="ONH"
              value={formData.ONH}
              onChange={handleChange}
              placeholder="Enter the ONH level"
            />
          </FormControl>
          <FormControl id="ONL" isRequired>
            <FormLabel>ONL</FormLabel>
            <Input
              className={styles.input}
              name="ONL"
              value={formData.ONL}
              onChange={handleChange}
              placeholder="Enter the ONL level"
            />
          </FormControl>
          <FormControl id="ONMID" isRequired>
            <FormLabel>ONMID</FormLabel>
            <Input
              className={styles.input}
              name="ONMID"
              value={formData.ONMID}
              onChange={handleChange}
              placeholder="Enter the ONMID level"
            />
          </FormControl>
          <FormControl id="ONVPOC" isRequired>
            <FormLabel>ONVPOC</FormLabel>
            <Input
              className={styles.input}
              name="ONVPOC"
              value={formData.ONVPOC}
              onChange={handleChange}
              placeholder="Enter the ONVPOC level"
            />
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="teal" size="lg" width="full">
            Save Trading Plan
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default TradingPlanForm
