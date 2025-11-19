import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { AppState } from '../types';

interface PricingProps {
  addCredits: (amount: number) => void;
  setCurrentPage: (page: AppState) => void;
}

export const Pricing: React.FC<PricingProps> = ({ addCredits, setCurrentPage }) => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      credits: 5,
      features: ['5 free credits', 'Standard speed', 'Basic support'],
      buttonText: 'Claim Free',
      isPopular: false,
      value: 5
    },
    {
      name: 'Pro',
      price: '$10',
      credits: 50,
      features: ['50 credits', 'Priority processing', 'History access', 'Email support'],
      buttonText: 'Buy Now',
      isPopular: true,
      value: 50
    },
    {
      name: 'Enterprise',
      price: '$49',
      credits: 300,
      features: ['300 credits', 'Highest priority', 'API Access', '24/7 Support'],
      buttonText: 'Contact Sales',
      isPopular: false,
      value: 300
    }
  ];

  const handlePurchase = (amount: number) => {
    // Simulate payment delay
    const btn = document.activeElement as HTMLButtonElement;
    if(btn) btn.disabled = true;
    
    setTimeout(() => {
      addCredits(amount);
      setCurrentPage(AppState.HOME);
      if(btn) btn.disabled = false;
    }, 800);
  };

  return (
    <div className="container max-w-6xl py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Simple, transparent pricing</h2>
        <p className="text-lg text-muted-foreground">
          Buy credits as you go. No monthly subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-primary shadow-lg scale-105 relative' : ''}`}>
            {tier.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                {tier.price !== '$0' && <span className="text-muted-foreground"> / one-time</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={tier.isPopular ? 'default' : 'outline'}
                onClick={() => handlePurchase(tier.value)}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};