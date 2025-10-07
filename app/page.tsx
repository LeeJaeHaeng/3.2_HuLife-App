import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HobbyCategories } from "@/components/hobby-categories"
import { FeaturedGroups } from "@/components/featured-groups"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HobbyCategories />
        <FeaturedGroups />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
