/**
 * @file Multi-step form component for product selection and checkout
 * @module MultiStepForm
 * @description This component handles product selection, verification, and checkout initiation
 */

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createCheckoutSession } from "@/app/server-actions/create-checkout-session";
import { getProducts } from "@/app/server-actions/get-products";

// Types and Interfaces
export interface StripePrice {
  id: string;
  currency: string;
  unit_amount: number;
  recurring?: {
    interval: string;
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  default_price: StripePrice;
  features?: string[];
}

interface UserData {
  product: string;
}

interface Errors extends Partial<UserData> {
  submit?: string;
}

interface MultiStepFormProps {
  initialTier?: string;
  initialPriceId?: string;
}

/**
 * @function MultiStepForm
 * @description Main component for the multi-step form
 * @param {MultiStepFormProps} props - Component props
 * @returns {JSX.Element} Rendered form component
 */
export default function MultiStepForm({
  initialTier,
  initialPriceId,
}: MultiStepFormProps): JSX.Element {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    product: initialTier || "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setErrors({ submit: "Failed to load products. Please try again." });
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialTier) {
      setUserData((prevData) => ({ ...prevData, product: initialTier }));
    }
  }, [initialTier]);

  const handleProductSelect = (productId: string) => {
    setUserData((prevData) => ({ ...prevData, product: productId }));
    setErrors((prevErrors) => ({ ...prevErrors, product: "" }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Errors = {};

    if (currentStep === 1 && !userData.product) {
      newErrors.product = "Please select a product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2 && validateStep(step)) {
      setIsLoading(true);
      try {
        const { url } = await createCheckoutSession(userData.product);
        window.location.href = url;
      } catch (error) {
        console.error("Error:", error);
        setErrors({ submit: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isProductsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Choose a Product"}
            {step === 2 && "Verify Information"}
          </CardTitle>
          <CardDescription>Step {step} of 2</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
            className="space-y-4"
          >
            {step === 1 && (
              <ProductSelectionStep
                products={products}
                userData={userData}
                errors={errors}
                handleProductSelect={handleProductSelect}
              />
            )}
            {step === 2 && (
              <VerificationStep userData={userData} products={products} />
            )}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
            <NavigationButtons
              step={step}
              handleBack={handleBack}
              handleNext={handleNext}
              isNextDisabled={step === 1 && !userData.product}
              isLoading={isLoading}
            />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

// Sub-components
interface ProductSelectionStepProps {
  products: StripeProduct[];
  userData: UserData;
  errors: Errors;
  handleProductSelect: (productId: string) => void;
}

/**
 * @function ProductSelectionStep
 * @description Component for the product selection step
 * @param {ProductSelectionStepProps} props - Component props
 * @returns {JSX.Element} Rendered product selection step
 */
function ProductSelectionStep({
  products,
  userData,
  errors,
  handleProductSelect,
}: ProductSelectionStepProps): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Compare our plans</h3>
        <p className="text-muted-foreground mt-2">
          Find the perfect plan for your needs
        </p>
      </div>
      {errors.product && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.product}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`overflow-hidden cursor-pointer transition-all relative ${
              userData.product === product.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleProductSelect(product.id)}
          >
            {userData.product === product.id && (
              <div className="absolute top-2 right-2 z-10">
                <Check className="h-6 w-6 text-primary bg-white rounded-full p-1" />
              </div>
            )}
            <CardHeader className="bg-muted">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: product.default_price.currency,
                    minimumFractionDigits: 0,
                  }).format(product.default_price.unit_amount / 100)}
                </span>
                {product.default_price.recurring &&
                  ` /${product.default_price.recurring.interval}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {product.features && product.features.length > 0 ? (
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No features listed</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface VerificationStepProps {
  userData: UserData;
  products: StripeProduct[];
}

/**
 * @function VerificationStep
 * @description Component for the verification step
 * @param {VerificationStepProps} props - Component props
 * @returns {JSX.Element} Rendered verification step
 */
function VerificationStep({
  userData,
  products,
}: VerificationStepProps): JSX.Element {
  const selectedProduct = products.find(
    (product) => product.id === userData.product,
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Verify Your Selection</h3>
      <div className="space-y-2">
        <p>
          <strong>Selected Product:</strong> {selectedProduct?.name}
        </p>
        <p>
          <strong>Price:</strong>{" "}
          {selectedProduct &&
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: selectedProduct.default_price.currency,
              minimumFractionDigits: 0,
            }).format(selectedProduct.default_price.unit_amount / 100)}
          {selectedProduct?.default_price.recurring &&
            ` /${selectedProduct.default_price.recurring.interval}`}
        </p>
        {selectedProduct?.features && selectedProduct.features.length > 0 && (
          <div>
            <strong>Features:</strong>
            <ul className="list-disc list-inside ml-4">
              {selectedProduct.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Please review your selection above. If everything is correct, click
        &quot;Proceed to Payment&quot; to continue.
      </p>
    </div>
  );
}

interface NavigationButtonsProps {
  step: number;
  handleBack: () => void;
  handleNext: () => void;
  isNextDisabled: boolean;
  isLoading: boolean;
}

/**
 * @function NavigationButtons
 * @description Component for navigation buttons
 * @param {NavigationButtonsProps} props - Component props
 * @returns {JSX.Element} Rendered navigation buttons
 */
function NavigationButtons({
  step,
  handleBack,
  handleNext,
  isNextDisabled,
  isLoading,
}: NavigationButtonsProps): JSX.Element {
  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
      )}
      {step === 1 ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleNext();
          }}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      ) : (
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
      )}
    </div>
  );
}
