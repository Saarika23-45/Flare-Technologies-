
import ResultsComponent from "@/components/Results"
import SEO from "@/components/SEO"

interface ResultsProps {
    openModal: () => void;
}

export default function Results({ openModal }: ResultsProps) {
    return (
        <main className="pt-24 pb-12 min-h-screen">
            <SEO
                title="Case Studies & Results | Flare Technologies"
                description="See how Flare Technologies has delivered measurable B2B marketing results for clients across industries."
                canonical="https://www.flaretechnologies.in/results"
            />
            <ResultsComponent openModal={openModal} />
        </main>
    );
}
