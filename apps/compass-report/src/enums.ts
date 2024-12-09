
export enum ConfidenceLevel {
    'Very limited' = 25,
    'Foundational' = 50,
    'Advanced' = 75,
    'Expert' = 100
  }

  export enum EntryConfidenceNames {
    VeryLimited = 'Very limited',
    Foundational = 'Foundational',
    Advanced = 'Advanced',
    Expert = 'Expert'
  }
  
  export enum ExitConfidenceLevel {
    'Completely unsure' = 25,
    'Slightly unsure' = 50,
    'Fairly sure' = 75,
    'Completely sure' = 100
  }

  export enum ExitConfidenceNames {
    CompletelyUnsure = 'Completely unsure',
    SlightlyUnsure = 'Slightly unsure',
    FairlySure = 'Fairly sure',
    CompletelySure = 'Completely sure'
  }

  export enum QuestionAreaNames {
    CodingAndBilling = 'Coding and Billing',
    Coverage = 'Coverage',
    PaymentAndReimbursement = 'Payment and Reimbursement',
    PricingAndContracting = 'Pricing and Contracting',
    ProductAcquisitionAndDistribution = 'Product Acquisition and Distribution'
  }

  export enum QuestionAreaKeys {
    CodingAndBilling = 'Medical coding and billing which relates to the standardized medical coding systems used to represent diagnoses, procedures, services, products, and the processes involved in submitting and managing healthcare claims',
    Coverage = 'Government and commercial healthcare coverage policies and procedures, including benefit design, denials and appeals, and utilization management strategies',
    PaymentAndReimbursement = 'Payment and reimbursement, including reimbursement models, rates and incentive programs',
    PricingAndContracting = 'Pricing and contracting, including pricing benchmarks, supply chain dynamics, regulatory compliance considerations, and the various stakeholders and their contracts',
    ProductAcquisitionAndDistribution = 'Product acquisition and distribution, including the buy and bill process, specialty pharmacy, and distribution channels'
  }

  export enum ExitConfidenceKeys {
    CodingAndBilling = 'Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Coding and Billing section you just completed.',
    Coverage = 'Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Coverage section you just completed.',
    PaymentAndReimbursement = 'Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Payment and Reimbursement section you just completed.',
    PricingAndContracting = 'Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Pricing and Contracting section you just completed.',
    ProductAcquisitionAndDistribution = 'Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Product Acquisition and Distribution section you just completed.'
  }