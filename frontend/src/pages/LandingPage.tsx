import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Wand2, Zap, Shield, Download, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="h-screen bg-background text-zinc-200 flex flex-col overflow-y-auto">
            <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wand2 className = "w-6 h-6 text-primary" />
                        <span className="text-xl font-bold text-white">ArchiGen AI</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <SignedOut>
                            <SignInButton mode = "modal">
                                <button className="text-sm text-zinc-400 hover:text-white transition-colors">Sign In</button>
                            </SignInButton>
                            <Link to ="/app">
                                <button className = "bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                            <Link to = "/app">
                                <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors">
                                    Go to App
                                </button>
                            </Link>
                        </SignedIn>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border-primary/20 text-primary text-xs font-medium mb-6">
                        <Zap className="w-3 h-3" /> Powered by Multi-Agent AI
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                        Architectural Diagrams, <br /> generated in seconds.
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
                        Describe your software system in plain english. Our AI pipeline designs the architecture, calculates the layout, and exports production-ready diagrams and decision records.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to = "/app">
                            <button className="bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg">
                                Start Generating Free
                            </button>
                        </Link>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border/50">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Everything you need to design systems</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={<Zap className="w-6 h-6 text-yellow-400" />} title = "Multi-Agent Pipeline" desc="Parser, Architecture, Layout, and Style agents work together to understand your intent  and build the perfect diagram." />
                        <FeatureCard icon={<Shield className="w-6 h-6 text-green-400" />} title = "Self-Healing Validation" desc="Built-in validator and repair agents ensure your diagrams are structurally sound and mathematically perfect." />
                        <FeatureCard icon={<Download className = "w-6 h-6 text-blue-400" />} title = "Multi-Format Export" desc = "Export to Excalidraw JSON, PNG, SVG, Mermaid.js,  or a comprehensive Markdown ADR." />
                    </div>                    
                </section>

                <section className="max-w-5xl mx-auto px-6 py-24 border-t border-border/50">
                    <h2 className="text-3xl font-bold text-center text-white mb-4">Simple, transparent pricings</h2>
                    <p className="text-center text-zinc-400 mb-12">Start for free, upgrade when you need more power.</p>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                        <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <p className="text-zinc-400 mb-6">Perfect for exploring and quick sketches.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">Rs.0</span>
                                <span className="text-zinc-500">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingFeature text = "5 diagrams per day" />
                                <PricingFeature text = "PNG, SVG, JSON Export" />
                                <PricingFeature text = "Basic AI annotations" />
                                <PricingFeature text = "Community support" />
                            </ul>
                            <Link to = "/app">
                                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border-2 border-primary relative flex flex-col shadow-xl shadow-primary/10">
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">PRO</div>
                            <h3 className="text-xl font-bold text-white mb-2">PRO</h3>
                            <p className="text-zinc-400 mb-6">For professional architects and teams.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">Free</span>
                                <span className="text-zinc-500">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                <PricingFeature text = "Unlimited Diagrams" />
                                <PricingFeature text = "Mermaid.js & Markdown ADR Export" />
                                <PricingFeature text = "Advanced AI refinement & Annotations" />
                                <PricingFeature text = "Priority AI processing" />
                                <PricingFeature text = "Save and manage diagram history" />
                            </ul>
                            <button className = "w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-colors cursor-not-allowed opacity-50">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        
            <footer className = "border-t border-border/50 py-8 text-center text-zinc-500 text-sm">
                © 2026 ArchiGen AI. Built with love by Atharva 💌
            </footer>
        </div>
    );
}


function FeatureCard({icon,title, desc}: {icon: React.ReactNode, title: string, desc: string}) {
    return (
        <div className="p-6 rounded-xl bg-surface  border border-border hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm"> {desc} </p>
        </div>
    );
}

function PricingFeature({ text }: {text: string}) {
    return (
        <li className="flex items-center gap-3 text-sm text-zinc-300">
            <CheckCircle2 className = "w-4 h-4 text-primary flex-shrink-0" />
            {text}
        </li>
    );
}
