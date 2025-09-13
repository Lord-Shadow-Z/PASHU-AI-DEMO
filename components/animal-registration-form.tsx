"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Camera,
  Lightbulb,
  Globe,
  CheckCircle,
  XCircle,
  Search,
  Check,
  Zap,
  Sparkles,
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Upload,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FormData {
  earTagNumber: string
  dataEntryDate: string
  taggingDate: string
  category: string
  species: string
  animalName: string
  sex: string
  dateOfBirth: string
  ageYear: string
  ageMonth: string
  image: File | null
}

const translations = {
  en: {
    title: "Animal Registration",
    userId: "User ID",
    fillForm: "Fill the form",
    earTagNumber: "Ear Tag Number",
    dataEntryDate: "Data Entry Date",
    taggingDate: "Tagging Date",
    category: "Category",
    species: "Species/Breed",
    nameOfAnimal: "Name of Animal",
    sex: "Sex",
    dateOfBirth: "Date Of Birth",
    age: "Age",
    imageDescription: "Image of the ear-tagged Animal along with farmer, showing ear tag number prominently",
    clickPhoto: "Click Photo",
    clearAll: "Clear All",
    submit: "Submit Registration",
    selectCategory: "Select Category",
    selectSex: "Select Sex",
    buffalo: "Buffalo",
    cattle: "Cattle",
    male: "Male",
    female: "Female",
    year: "Year",
    month: "Month",
    detectingBreed: "Detecting breed...",
    breedDetected: "Breed",
    aiWillDetect: "Upload image first to enable",
    suggestBreed: "Suggest Breed (if known by farmer)",
    enterBreedName: "Enter breed name",
    set: "Set",
    cancel: "Cancel",
    suggest: "Suggest",
    breedValidation: "Validating breed...",
    breedCorrect: "Breed matches image!",
    breedIncorrect: "Breed doesn't match. Suggested:",
    waitForImage: "Please upload image first to enable species entry",
    manualEntry: "Or enter manually if known",
    registrationSuccess: "Registration Successful!",
    registrationSuccessMessage: "Animal has been successfully registered in the Bharat Pashudhan Database.",
    registrationId: "Registration ID",
    submitting: "Submitting...",
    registerNewAnimal: "Register New Animal",
    autoDetect: "Auto Detect",
    detectingCategory: "Detecting category...",
    categoryDetected: "Category detected:",
    manualSelect: "Manual Select",
  },
  hi: {
    title: "पशु पंजीकरण",
    userId: "उपयोगकर्ता आईडी",
    fillForm: "फॉर्म भरें",
    earTagNumber: "कान टैग नंबर",
    dataEntryDate: "डेटा प्रविष्टि दिनांक",
    taggingDate: "टैगिंग दिनांक",
    category: "श्रेणी",
    species: "प्रजाति/नस्ल",
    nameOfAnimal: "पशु का नाम",
    sex: "लिंग",
    dateOfBirth: "जन्म तिथि",
    age: "आयु",
    imageDescription: "किसान के साथ कान-टैग वाले पशु की तस्वीर, कान टैग नंबर स्पष्ट रूप से दिखाते हुए",
    clickPhoto: "फोटो लें",
    clearAll: "सभी साफ़ करें",
    submit: "पंजीकरण जमा करें",
    selectCategory: "श्रेणी चुनें",
    selectSex: "लिंग चुनें",
    buffalo: "भैंस",
    cattle: "गाय",
    male: "नर",
    female: "मादा",
    year: "वर्ष",
    month: "महीना",
    detectingBreed: "नस्ल की पहचान हो रही है...",
    breedDetected: "नस्ल",
    aiWillDetect: "पहले छवि अपलोड करें",
    suggestBreed: "नस्ल सुझाएं (यदि किसान को पता है)",
    enterBreedName: "नस्ल का नाम दर्ज करें",
    set: "सेट करें",
    cancel: "रद्द करें",
    suggest: "सुझाएं",
    breedValidation: "नस्ल की जांच हो रही है...",
    breedCorrect: "नस्ल छवि से मेल खाती है!",
    breedIncorrect: "नस्ल मेल नहीं खाती। सुझाव:",
    waitForImage: "प्रजाति प्रविष्टि सक्षम करने के लिए पहले छवि अपलोड करें",
    manualEntry: "या यदि पता है तो मैन्युअल रूप से दर्ज करें",
    registrationSuccess: "पंजीकरण सफल!",
    registrationSuccessMessage: "पशु को भारत पशुधन डेटाबेस में सफलतापूर्वक पंजीकृत कर दिया गया है।",
    registrationId: "पंजीकरण आईडी",
    submitting: "जमा हो रहा है...",
    registerNewAnimal: "नया पशु पंजीकृत करें",
    autoDetect: "स्वचालित पहचान",
    detectingCategory: "श्रेणी की पहचान हो रही है...",
    categoryDetected: "श्रेणी की पहचान:",
    manualSelect: "मैन्युअल चयन",
  },
}

const breedDatabase = [
  "Holstein Friesian",
  "Jersey",
  "Gir",
  "Sahiwal",
  "Red Sindhi",
  "Tharparkar",
  "Murrah Buffalo",
  "Nili-Ravi Buffalo",
  "Mehsana Buffalo",
  "Jaffarabadi Buffalo",
  "Surti Buffalo",
  "Bhadawari Buffalo",
  "Nagpuri Buffalo",
  "Pandharpuri Buffalo",
]

export default function AnimalRegistrationForm() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const t = translations[language]

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState<FormData>({
    earTagNumber: "",
    dataEntryDate: new Date().toLocaleDateString("en-GB"),
    taggingDate: new Date().toLocaleDateString("en-GB"),
    category: "",
    species: "",
    animalName: "",
    sex: "",
    dateOfBirth: "",
    ageYear: "",
    ageMonth: "",
    image: null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isBreedDetected, setIsBreedDetected] = useState(false)
  const [detectedBreed, setDetectedBreed] = useState("")
  const [showBreedSuggestion, setShowBreedSuggestion] = useState(false)
  const [suggestedBreed, setSuggestedBreed] = useState("")
  const [speciesInput, setSpeciesInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([])
  const [isDetectingFromImage, setIsDetectingFromImage] = useState(false)
  const [isValidatingBreed, setIsValidatingBreed] = useState(false)
  const [breedValidationResult, setBreedValidationResult] = useState<"correct" | "incorrect" | null>(null)
  const [aiSuggestedBreed, setAiSuggestedBreed] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [registrationId, setRegistrationId] = useState("")

  const [isDetectingCategory, setIsDetectingCategory] = useState(false)
  const [detectedCategory, setDetectedCategory] = useState("")
  const [categoryMode, setCategoryMode] = useState<"auto" | "manual">("auto")

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed"
    if (step === currentStep) return "active"
    return "inactive"
  }

  const stepLabels = {
    en: ["Upload", "Details", "Breed", "Submit"],
    hi: ["अपलोड", "विवरण", "नस्ल", "जमा करें"],
  }

  useEffect(() => {
    if (formData.image && !isDetectingFromImage) {
      setCurrentStep(2)
    }
    if (formData.image && formData.earTagNumber && formData.category && formData.sex) {
      setCurrentStep(3)
    }
    if (formData.species && breedValidationResult === "correct") {
      setCurrentStep(4)
    }
  }, [formData, breedValidationResult, isDetectingFromImage])

  const handleNumberInput = (value: string) => {
    return value.replace(/[^0-9]/g, "")
  }

  const handleTextInput = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "")
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    let validatedValue = value

    if (field === "earTagNumber" || field === "ageYear" || field === "ageMonth") {
      validatedValue = handleNumberInput(value)
    } else if (field === "animalName") {
      validatedValue = handleTextInput(value)
    }

    setFormData((prev) => ({ ...prev, [field]: validatedValue }))
  }

  const handleAcceptAiSuggestion = () => {
    setSpeciesInput(aiSuggestedBreed)
    setFormData((prev) => ({ ...prev, species: aiSuggestedBreed }))
    setBreedValidationResult("correct")
    setShowSuggestions(false)
  }

  const handleBreedSuggestion = () => {
    setSpeciesInput(suggestedBreed)
    setFormData((prev) => ({ ...prev, species: suggestedBreed }))
    setShowBreedSuggestion(false)
    setSuggestedBreed("")
  }

  useEffect(() => {
    if (speciesInput.trim() && formData.image) {
      const filtered = breedDatabase.filter((breed) => breed.toLowerCase().includes(speciesInput.toLowerCase()))
      setFilteredBreeds(filtered)
      setShowSuggestions(filtered.length > 0 && speciesInput.length > 1)
    } else {
      setShowSuggestions(false)
      setFilteredBreeds([])
    }
  }, [speciesInput, formData.image])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setBreedValidationResult(null)
        setIsValidatingBreed(false)

        if (categoryMode === "auto") {
          setIsDetectingCategory(true)
          setTimeout(() => {
            // Simulate AI category detection
            const categories = ["buffalo", "cattle"]
            const detected = categories[Math.floor(Math.random() * categories.length)]
            setDetectedCategory(detected)
            setFormData((prev) => ({ ...prev, category: detected }))
            setIsDetectingCategory(false)
          }, 1500)
        }

        setIsDetectingFromImage(true)
        setTimeout(() => {
          const detectedBreeds = breedDatabase.slice(0, 3) // Top 3 AI suggestions
          setFilteredBreeds(detectedBreeds)
          setIsDetectingFromImage(false)

          if (detectedBreeds.length > 0) {
            setAiSuggestedBreed(detectedBreeds[0])
          }
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSpeciesInputChange = (value: string) => {
    setSpeciesInput(value)
    setFormData((prev) => ({ ...prev, species: value }))

    if (value.trim() && formData.image) {
      setIsValidatingBreed(true)
      setBreedValidationResult(null)

      setTimeout(() => {
        const isCorrect =
          breedDatabase.some((breed) => breed.toLowerCase() === value.toLowerCase()) && Math.random() > 0.2 // 80% accuracy for valid breeds

        setIsValidatingBreed(false)
        setBreedValidationResult(isCorrect ? "correct" : "incorrect")

        if (!isCorrect) {
          const suggested =
            breedDatabase.find((breed) => breed.toLowerCase().includes(value.toLowerCase())) ||
            breedDatabase[Math.floor(Math.random() * breedDatabase.length)]
          setAiSuggestedBreed(suggested)
        }
      }, 1500)
    }
  }

  const handleAiSuggestBreed = () => {
    if (formData.image && breedDatabase.length > 0) {
      const randomBreed = breedDatabase[Math.floor(Math.random() * breedDatabase.length)]
      setSpeciesInput(randomBreed)
      setFormData((prev) => ({ ...prev, species: randomBreed }))
      setBreedValidationResult("correct")
      setShowSuggestions(false)
    }
  }

  const handleSelectBreed = (breed: string) => {
    setSpeciesInput(breed)
    setFormData((prev) => ({ ...prev, species: breed }))
    setShowSuggestions(false)
    setBreedValidationResult("correct")
  }

  const handleClearAll = () => {
    setFormData({
      earTagNumber: "",
      dataEntryDate: new Date().toLocaleDateString("en-GB"),
      taggingDate: new Date().toLocaleDateString("en-GB"),
      category: "",
      species: "",
      animalName: "",
      sex: "",
      dateOfBirth: "",
      ageYear: "",
      ageMonth: "",
      image: null,
    })
    setImagePreview(null)
    setIsBreedDetected(false)
    setDetectedBreed("")
    setShowBreedSuggestion(false)
    setSuggestedBreed("")
    setSpeciesInput("")
    setShowSuggestions(false)
    setFilteredBreeds([])
    setIsDetectingFromImage(false)
    setCurrentStep(1)
  }

  const handleSubmit = async () => {
    if (!isFormValid) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate registration ID
    const regId = `BPA${Date.now().toString().slice(-8)}`
    setRegistrationId(regId)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleNewRegistration = () => {
    setIsSubmitted(false)
    setRegistrationId("")
    setIsDetectingCategory(false)
    setDetectedCategory("")
    setCategoryMode("auto")
    setCurrentStep(1)
    handleClearAll()
  }

  const isFormValid =
    formData.earTagNumber &&
    formData.category &&
    formData.sex &&
    formData.image &&
    formData.species &&
    breedValidationResult === "correct"

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-agricultural-gradient cattle-pattern relative overflow-hidden">
        <div className="fixed top-0 left-0 right-0 bg-emerald-800 text-white shadow-lg z-50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-white/80 hover:text-white cursor-pointer" />
              <div className="relative">
                <img
                  src="/bharat-pashudhan-logo-new.png"
                  alt="Bharat Pashudhan Logo"
                  className="w-8 h-8 rounded-full shadow-md border border-white/30 object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide">
                  {language === "en" ? "BHARAT PASHUDHAN" : "भारत पशुधन"}
                </h1>
                <p className="text-xs text-white/80 font-medium">{t.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="text-white hover:bg-white/20 bg-emerald-700 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-300 border border-white/30"
              >
                <Globe className="h-3 w-3 mr-1" />
                <span className="text-white font-bold">{language === "en" ? "हिं" : "EN"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 bg-emerald-700 rounded-lg border border-white/30"
              >
                <Menu className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-24 p-6 flex items-center justify-center min-h-screen relative z-10">
          <Card className="w-full max-w-md border-0 shadow-agricultural-lg bg-white/95 backdrop-blur-sm relative overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full p-6 w-28 h-28 mx-auto mb-4 flex items-center justify-center shadow-agricultural relative animate-bounce">
              <Check className="h-14 w-14 text-green-600 animate-in zoom-in-50 duration-700 delay-300" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 animate-ping"></div>
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-6 w-28 h-28 mx-auto mb-4 flex items-center justify-center shadow-agricultural relative animate-bounce">
                  <Check className="h-14 w-14 text-green-600 animate-in zoom-in-50 duration-700 delay-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 animate-ping"></div>
                </div>
                <h2 className="text-2xl font-black text-agricultural-gradient mb-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-500">
                  {t.registrationSuccess}
                </h2>
                <p className="text-gray-600 text-balance leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-700">
                  {t.registrationSuccessMessage}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6 shadow-inner relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-1000">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient"></div>
                <p className="text-sm font-bold text-emerald-700 mb-2">{t.registrationId}</p>
                <p className="text-2xl font-black text-emerald-800 font-mono tracking-wider">{registrationId}</p>
              </div>

              <Button
                onClick={handleNewRegistration}
                className="w-full h-14 bg-primary-gradient hover:shadow-agricultural-lg text-white rounded-2xl font-bold shadow-agricultural transition-all duration-300 relative overflow-hidden group hover:scale-105 transform animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-1200 ripple"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t.registerNewAnimal}
              </Button>

              <div className="mt-8 pt-6 border-t border-gray-200 animate-in fade-in-0 duration-500 delay-1500">
                <p className="text-sm text-gray-600 text-center">
                  Made by <span className="font-black text-primary">Binary Blades</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Project: <span className="font-bold text-primary">Pashu AI</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-agricultural-gradient cattle-pattern relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 bg-emerald-800 text-white shadow-lg z-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="relative flex justify-center items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white/80 bg-white">
                <img
                  src="/bharat-pashudhan-logo-new.png"
                  alt="Bharat Pashudhan Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/40 to-orange-500/40 rounded-full blur-lg animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                {language === "en" ? "BHARAT PASHUDHAN" : "भारत पशुधन"}
              </h1>
              <p className="text-xs text-white/80 font-medium">{t.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="text-white hover:bg-white/20 bg-emerald-700 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-300 border border-white/30"
            >
              <Globe className="h-3 w-3 mr-1" />
              <span className="text-white font-bold">{language === "en" ? "हिं" : "EN"}</span>
            </Button>
          </div>
        </div>
        <div className="px-4 pb-2 bg-emerald-800">
          <div className="bg-emerald-700 rounded-lg px-3 py-1 border border-white/20 shadow-sm">
            <p className="text-white font-medium text-xs">
              {t.userId}: <span className="text-yellow-300 font-bold">UV7384627540</span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-3 text-9xl animate-pulse delay-1000">🐄</div>
        <div className="absolute top-40 right-20 opacity-3 text-7xl animate-pulse delay-2000">🐃</div>
        <div className="absolute bottom-32 left-20 opacity-3 text-8xl animate-pulse delay-3000">🐄</div>
        <div className="absolute bottom-60 right-10 opacity-3 text-6xl animate-pulse delay-4000">🐃</div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-200/10 to-emerald-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-200/10 to-green-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="px-6 pb-4 bg-emerald-800">
        <div className="flex items-center justify-between mb-3">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn("progress-step", getStepStatus(step))}>
                {getStepStatus(step) === "completed" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{step}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-1 w-8 mx-2 rounded-full transition-all duration-300",
                    step < currentStep ? "bg-green-500" : "bg-white/30",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-white font-medium">
          {stepLabels[language].map((label, index) => (
            <span
              key={index}
              className={cn(
                "transition-all duration-300",
                index + 1 === currentStep ? "text-white font-bold" : "text-white/80",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div className="pt-28 p-6 space-y-6 relative z-10">
          <Card className="border-0 shadow-agricultural-lg bg-white/98 backdrop-blur-lg relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-8 duration-700 hover:shadow-agricultural transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-green-50/30"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-primary-gradient"></div>

            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-16 bg-primary-gradient rounded-full shadow-lg"></div>
                <h2 className="text-3xl font-black text-agricultural-gradient">{t.fillForm}</h2>
                <div className="flex-1 h-1 bg-gradient-to-r from-green-200 to-transparent rounded-full"></div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="relative group">
                  <Label htmlFor="earTag" className="text-lg font-bold text-gray-800 flex items-center gap-3 mb-3">
                    {t.earTagNumber} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="earTag"
                      placeholder="eg. 123456789012"
                      value={formData.earTagNumber}
                      onChange={(e) => handleInputChange("earTagNumber", e.target.value)}
                      className="text-xl h-16 bg-white border-2 border-gray-200 focus:border-primary rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl focus:shadow-agricultural focus:ring-4 focus:ring-primary/20 focus:scale-[1.02] transform"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t.dataEntryDate}
                    </Label>
                    <Input
                      value={formData.dataEntryDate}
                      onChange={(e) => handleInputChange("dataEntryDate", e.target.value)}
                      className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t.taggingDate} *
                    </Label>
                    <Input
                      value={formData.taggingDate}
                      onChange={(e) => handleInputChange("taggingDate", e.target.value)}
                      className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    {t.category} *
                  </Label>

                  <div className="flex gap-3 mb-4">
                    <Button
                      type="button"
                      variant={categoryMode === "auto" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryMode("auto")}
                      className="flex items-center gap-2 h-12 px-6 rounded-xl font-bold hover:scale-105 transform transition-all duration-200 ripple"
                    >
                      <Zap className="h-4 w-4" />
                      {t.autoDetect}
                    </Button>
                    <Button
                      type="button"
                      variant={categoryMode === "manual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryMode("manual")}
                      className="h-12 px-6 rounded-xl font-bold hover:scale-105 transform transition-all duration-200 ripple"
                    >
                      {t.manualSelect}
                    </Button>
                  </div>

                  {categoryMode === "auto" ? (
                    <div className="space-y-3">
                      {!formData.image ? (
                        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl animate-pulse">
                          <p className="text-base font-bold text-blue-700 text-center flex items-center justify-center gap-2">
                            <Upload className="h-5 w-5" />
                            {t.aiWillDetect}
                          </p>
                        </div>
                      ) : isDetectingCategory ? (
                        <div className="flex items-center gap-4 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-base font-bold text-blue-700">{t.detectingCategory}</span>
                        </div>
                      ) : detectedCategory ? (
                        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center gap-4">
                            <CheckCircle className="h-6 w-6 text-green-600 animate-in zoom-in-50 duration-300" />
                            <span className="text-base font-bold text-green-700">
                              {t.categoryDetected} {detectedCategory === "buffalo" ? t.buffalo : t.cattle}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent className="animate-in slide-in-from-top-2 fade-in-0 duration-200">
                        <SelectItem
                          value="buffalo"
                          className="hover:bg-green-50 transition-colors duration-150 text-base py-3"
                        >
                          🐃 {t.buffalo}
                        </SelectItem>
                        <SelectItem
                          value="cattle"
                          className="hover:bg-green-50 transition-colors duration-150 text-base py-3"
                        >
                          🐄 {t.cattle}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {t.nameOfAnimal}
                    </Label>
                    <Input
                      placeholder="eg. Ganga"
                      value={formData.animalName}
                      onChange={(e) => handleInputChange("animalName", e.target.value)}
                      className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {t.sex} *
                    </Label>
                    <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                      <SelectTrigger className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder={t.selectSex} />
                      </SelectTrigger>
                      <SelectContent className="animate-in slide-in-from-top-2 fade-in-0 duration-200">
                        <SelectItem
                          value="male"
                          className="hover:bg-green-50 transition-colors duration-150 text-base py-3"
                        >
                          ♂️ {t.male}
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="hover:bg-green-50 transition-colors duration-150 text-base py-3"
                        >
                          ♀️ {t.female}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t.dateOfBirth} *
                    </Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t.age} *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder={t.year}
                        value={formData.ageYear}
                        onChange={(e) => handleInputChange("ageYear", e.target.value)}
                        className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                      />
                      <Input
                        placeholder={t.month}
                        value={formData.ageMonth}
                        onChange={(e) => handleInputChange("ageMonth", e.target.value)}
                        className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-3 text-pretty flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {t.imageDescription}
                    </h3>

                    {imagePreview ? (
                      <Card className="border-2 border-dashed border-green-300 bg-green-50/50 animate-in fade-in-0 zoom-in-95 duration-500">
                        <CardContent className="p-4">
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Animal preview"
                              className="w-full h-64 object-cover rounded-xl shadow-md"
                            />
                            {isDetectingFromImage && (
                              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center animate-in fade-in-0 duration-300">
                                <div className="bg-white rounded-lg p-4 flex items-center gap-3 animate-pulse">
                                  <div className="text-2xl animate-bounce">🐄</div>
                                  <span className="text-lg font-bold text-gray-700">Analyzing image...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="image-upload"
                        />
                        <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-all duration-300 bg-gray-50/50 hover:bg-green-50/50 hover:scale-[1.02] transform">
                          <CardContent className="p-8">
                            <div className="text-center">
                              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center hover:scale-110 transform transition-all duration-200">
                                <Camera className="h-10 w-10 text-green-600" />
                              </div>
                              <Button
                                variant="outline"
                                className="text-lg h-14 px-8 bg-white border-2 border-green-200 hover:bg-green-50 hover:border-green-400 rounded-xl font-bold hover:scale-105 transform transition-all duration-200 ripple"
                              >
                                <Camera className="h-5 w-5 mr-2" />
                                {t.clickPhoto}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    {t.species} *
                  </Label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        value={speciesInput}
                        onChange={(e) => handleSpeciesInputChange(e.target.value)}
                        placeholder={formData.image ? "Start typing breed name..." : t.waitForImage}
                        disabled={!formData.image}
                        className="text-lg h-14 bg-white border-2 border-gray-200 focus:border-primary rounded-xl shadow-sm pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.02] transform hover:shadow-md"
                      />
                      {formData.image && (
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      )}

                      {showSuggestions && (
                        <Card className="absolute top-full left-0 right-0 mt-2 z-20 border-2 border-green-200 shadow-xl bg-white animate-in slide-in-from-top-2 fade-in-0 duration-200">
                          <CardContent className="p-2">
                            <div className="text-xs font-bold text-green-600 mb-2 px-2">AI Suggestions:</div>
                            {filteredBreeds.slice(0, 5).map((breed, index) => (
                              <button
                                key={breed}
                                onClick={() => handleSelectBreed(breed)}
                                className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-xl text-sm font-bold text-gray-700 transition-all duration-150 hover:scale-[1.02] transform"
                              >
                                {breed}
                              </button>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={handleAiSuggestBreed}
                      disabled={!formData.image}
                      className="h-14 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md font-bold transition-all duration-200 hover:scale-110 transform disabled:hover:scale-100 ripple"
                      title="AI Suggest Breed"
                    >
                      <Lightbulb className="h-5 w-5" />
                    </Button>
                  </div>

                  {formData.image && speciesInput && (
                    <div className="mt-3">
                      {isValidatingBreed && (
                        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-lg font-bold text-blue-700">{t.breedValidation}</span>
                        </div>
                      )}

                      {breedValidationResult === "correct" && (
                        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-500">
                          <CheckCircle className="h-6 w-6 text-green-600 animate-in zoom-in-50 duration-300" />
                          <span className="text-lg font-bold text-green-700">{t.breedCorrect}</span>
                        </div>
                      )}

                      {breedValidationResult === "incorrect" && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-500">
                          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <XCircle className="h-6 w-6 text-red-600" />
                            <span className="text-lg font-bold text-red-700">{t.breedIncorrect}</span>
                          </div>
                          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
                            <CardContent className="p-4">
                              <p className="text-sm font-bold text-amber-800 mb-3">
                                🤖 AI Suggestion: {aiSuggestedBreed}
                              </p>
                              <Button
                                size="sm"
                                onClick={handleAcceptAiSuggestion}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold px-6 py-3 hover:scale-105 transform transition-all duration-200 ripple"
                              >
                                {t.set}
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {showBreedSuggestion && (
                  <div className="mt-2 p-3 bg-muted rounded-xl border">
                    <Label className="text-sm font-bold text-foreground mb-2 block">{t.suggestBreed}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={suggestedBreed}
                        onChange={(e) => setSuggestedBreed(e.target.value)}
                        placeholder={t.enterBreedName}
                        className="text-base h-10 bg-background"
                      />
                      <Button onClick={handleBreedSuggestion} disabled={!suggestedBreed.trim()} className="h-10 px-4">
                        {t.set}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowBreedSuggestion(false)
                          setSuggestedBreed("")
                        }}
                        className="h-10 px-4"
                      >
                        {t.cancel}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    disabled={isSubmitting}
                    className="flex-1 h-14 text-base border-2 border-gray-300 hover:bg-gray-50 bg-white rounded-2xl font-bold disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:hover:scale-100"
                  >
                    {t.clearAll}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className={cn(
                      "flex-1 h-14 text-base rounded-2xl font-bold shadow-2xl transition-all duration-300 relative overflow-hidden group transform",
                      isFormValid && !isSubmitting
                        ? "bg-primary-gradient hover:shadow-agricultural-lg text-white shadow-agricultural hover:shadow-agricultural-lg hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none hover:scale-100",
                    )}
                  >
                    {isFormValid && !isSubmitting && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        {t.submitting}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {t.submit}
                      </div>
                    )}
                  </Button>
                </div>

                <div className="mt-10 pt-8 border-t-2 border-gradient-to-r from-emerald-200 to-green-200 text-center animate-in fade-in-0 duration-500 delay-300">
                  <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] transform relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-2xl"></div>

                    <p className="text-xl font-black text-gray-800 mb-3">
                      Made by{" "}
                      <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                        Binary Blades
                      </span>
                    </p>
                    <p className="text-lg text-gray-700 font-semibold">
                      Project: <span className="font-black text-emerald-700 text-xl">Pashu AI</span>
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
