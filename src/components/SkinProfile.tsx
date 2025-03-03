
import React, { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import { SkinType } from '@/models/product';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const skinTypes: { value: SkinType; label: string; description: string }[] = [
  { 
    value: 'normal', 
    label: 'Normal', 
    description: 'Well-balanced: neither too oily nor too dry' 
  },
  { 
    value: 'dry', 
    label: 'Dry', 
    description: 'Lacks oil, may feel tight or rough' 
  },
  { 
    value: 'oily', 
    label: 'Oily', 
    description: 'Excess oil, especially in T-zone' 
  },
  { 
    value: 'combination', 
    label: 'Combination', 
    description: 'Oily T-zone, normal to dry elsewhere' 
  },
  { 
    value: 'sensitive', 
    label: 'Sensitive', 
    description: 'Easily irritated, may react to many products' 
  },
];

const commonConcerns = [
  'Acne', 'Aging', 'Dullness', 'Dryness', 'Hyperpigmentation', 
  'Redness', 'Pores', 'Texture', 'Blackheads', 'Wrinkles'
];

const commonAllergies = [
  'Fragrance', 'Preservatives', 'Sulfates', 'Parabens', 'Essential Oils',
  'Lanolin', 'Propylene Glycol', 'Formaldehyde', 'Nickel', 'Latex'
];

const SkinProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { skinProfile, setSkinProfile, isLoading } = useProducts();
  
  const [selectedType, setSelectedType] = useState<SkinType>(
    skinProfile?.type || 'normal'
  );
  
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    skinProfile?.concerns || []
  );
  
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    skinProfile?.allergies || []
  );
  
  // Update local state when skin profile is loaded from database
  useEffect(() => {
    if (skinProfile) {
      setSelectedType(skinProfile.type);
      setSelectedConcerns(skinProfile.concerns);
      setSelectedAllergies(skinProfile.allergies);
    }
  }, [skinProfile]);
  
  const handleSkinTypeChange = (type: SkinType) => {
    setSelectedType(type);
  };
  
  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };
  
  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };
  
  const handleSave = () => {
    const updatedProfile = {
      type: selectedType,
      concerns: selectedConcerns,
      allergies: selectedAllergies
    };
    
    console.log('Saving skin profile:', updatedProfile);
    setSkinProfile(updatedProfile);
    
    toast({
      title: "Profile Saved",
      description: "Your skin profile has been updated successfully.",
    });
    
    // Redirect to home page after saving
    navigate('/home');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        <p className="text-gray-500">Loading your skin profile...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium mb-3">Skin Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skinTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleSkinTypeChange(type.value)}
              className={`
                text-left p-3 rounded-lg border transition-all
                ${selectedType === type.value 
                  ? 'border-brand-accent bg-brand-accent bg-opacity-5' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{type.label}</span>
                {selectedType === type.value && (
                  <Check size={16} className="text-brand-accent" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Skin Concerns</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Select any concerns you'd like us to consider when analyzing products.
        </p>
        <div className="flex flex-wrap gap-2">
          {commonConcerns.map((concern) => (
            <button
              key={concern}
              onClick={() => toggleConcern(concern)}
              className={`
                px-3 py-1.5 rounded-full text-sm transition-all
                ${selectedConcerns.includes(concern)
                  ? 'bg-brand-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Allergies & Sensitivities</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Select any ingredients you're allergic or sensitive to.
        </p>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((allergy) => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={`
                px-3 py-1.5 rounded-full text-sm transition-all
                ${selectedAllergies.includes(allergy)
                  ? 'bg-brand-danger text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full bg-brand-accent text-white font-medium py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default SkinProfile;
