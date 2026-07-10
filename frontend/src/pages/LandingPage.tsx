import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Wand2, Zap, Shield, Download, CheckCircle2 } from "lucide-react";
import heroMockup from "../assets/hero_mockup.jpg";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-mesh text-zinc-200 flex flex-col">
            {/* Header */}
            <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-black/40">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 group cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent-violet flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                            <Wand2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                            ArchiGen AI
                        </span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <Link to="/app">
                                <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                                    Get Started
                                </button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center gap-4">
                                <UserButton 
                                    afterSignOutUrl="/" 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 rounded-full border border-white/10 hover:border-primary/50 transition-colors"
                                        }
                                    }}
                                />
                                <Link to="/app">
                                    <button className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                                        Go to App
                                    </button>
                                </Link>
                            </div>
                        </SignedIn>
                    </nav>
                </div>
            </header>

            <main className="flex-1 pb-24">
                {/* Hero Section */}
                <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-accent text-xs font-semibold mb-8 animate-pulse-glow">
                        <Zap className="w-3.5 h-3.5 fill-primary/20" /> Powered by Multi-Agent AI
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] max-w-4xl bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                        Architectural Diagrams, <br /> generated in seconds.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Describe your software system in plain English. Our AI pipeline designs the architecture, calculates the layout, and exports production-ready diagrams and decision records.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <Link to="/app">
                            <button className="bg-white text-black hover:bg-zinc-200 font-bold py-3.5 px-10 rounded-xl transition-all text-lg shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-95">
                                Start Generating Free
                            </button>
                        </Link>
                    </div>

                    {/* App Mockup Showcase Container */}
                    <div className="w-full max-w-4xl animate-float rounded-2xl p-1.5 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_0_80px_-15px_rgba(99,102,241,0.25)]">
                        <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950/80">
                            {/* Window Header */}
                            <div className="bg-zinc-900/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent-rose/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-accent-emerald/80" />
                                <div className="mx-auto text-xs text-zinc-500 font-medium select-none">archigen-ai-dashboard.app</div>
                            </div>
                            {/* Showcase Image */}
                            <img 
                                src={heroMockup} 
                                alt="ArchiGen AI Application Dashboard Preview" 
                                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white tracking-tight mb-4">
                        Everything you need to design systems
                    </h2>
                    <p className="text-center text-zinc-400 max-w-xl mx-auto mb-16 text-sm md:text-base">
                        Skip drawing boxes manually. Our autonomous agent system handles everything from design rules to layout math.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Zap className="w-6 h-6 text-yellow-400" />} 
                            title="Multi-Agent Pipeline" 
                            desc="Parser, Architecture, Layout, and Style agents work together in sequence to understand your intent and construct the perfect flowchart." 
                        />
                        <FeatureCard 
                            icon={<Shield className="w-6 h-6 text-accent-emerald" />} 
                            title="Self-Healing Validation" 
                            desc="Built-in validator and repair agents test connection intersections and layouts, fixing structure flaws dynamically in a 3-turn feedback loop." 
                        />
                        <FeatureCard 
                            icon={<Download className="w-6 h-6 text-blue-400" />} 
                            title="Multi-Format Export" 
                            desc="Export your final models to Excalidraw JSON, PNG/SVG vectors, Mermaid.js markdown files, or a detailed Markdown Architecture Decision Record." 
                        />
                    </div>                    
                </section>

                {/* Pricing Section */}
                <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white tracking-tight mb-3">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-center text-zinc-400 mb-16">Start for free, upgrade when you need more power.</p>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="p-8 rounded-2xl bg-surface/40 border border-white/5 flex flex-col glass-panel hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
                            <p className="text-zinc-400 text-sm mb-6">Perfect for exploring and quick architecture sketches.</p>
                            <div className="mb-8">
                                <span className="text-5xl font-extrabold text-white tracking-tight">Rs.0</span>
                                <span className="text-zinc-500 text-sm"> / month</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <PricingFeature text="5 diagrams per day" />
                                <PricingFeature text="PNG, SVG, JSON Export" />
                                <PricingFeature text="Basic AI annotations" />
                                <PricingFeature text="Community support" />
                            </ul>
                            <Link to="/app">
                                <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl border border-white/5 transition-all active:scale-98">
                                    Get Started Free
                                </button>
                            </Link>
                        </div>

                        {/* Pro Tier (Glowing/Featured Card) */}
                        <div className="p-8 rounded-2xl bg-surface/50 border border-primary/30 relative flex flex-col shadow-2xl shadow-primary/5 overflow-hidden glass-panel glow-border">
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-primary to-accent-violet text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                Recommended
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">PRO Plan</h3>
                            <p className="text-zinc-400 text-sm mb-6">For professional architects, developers, and product teams.</p>
                            <div className="mb-8">
                                <span className="text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-primary-accent to-accent-violet bg-clip-text text-transparent">Free</span>
                                <span className="text-zinc-500 text-sm"> / month (Beta)</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <PricingFeature text="Unlimited Diagrams" />
                                <PricingFeature text="Mermaid.js & Markdown ADR Export" />
                                <PricingFeature text="Advanced AI refinement & Annotations" />
                                <PricingFeature text="Priority AI processing queue" />
                                <PricingFeature text="Save and manage diagram history" />
                            </ul>
                            <button className="w-full bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-98 cursor-not-allowed opacity-60">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        
            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center text-zinc-500 text-sm bg-black/20">
                © 2026 ArchiGen AI. Built with love by Atharva 💌
            </footer>
        </div>
    );
}

function FeatureCard({icon, title, desc}: {icon: React.ReactNode, title: string, desc: string}) {
    return (
        <div className="p-7 rounded-xl bg-surface/40 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 glass-panel group">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function PricingFeature({ text }: {text: string}) {
    return (
        <li className="flex items-center gap-3 text-sm text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-accent" />
            </div>
            <span>{text}</span>
        </li>
    );
}
