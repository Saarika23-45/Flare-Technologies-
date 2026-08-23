import MethodologyComponent from "@/components/Methodology"
import SEO from "@/components/SEO"

interface MethodologyProps {
    openModal: () => void;
}

export default function Methodology({ openModal }: MethodologyProps) {
    return (
        <main className="pt-24 pb-12 min-h-screen methodology-theme">
            <SEO
                title="Our Methodology | Flare Technologies"
                description="Discover the agile, senior-led methodology Flare Technologies uses to deliver B2B marketing outcomes."
                canonical="https://www.flaretechnologies.in/methodology"
            />
            <MethodologyComponent openModal={openModal} />
        </main>
    );
}
