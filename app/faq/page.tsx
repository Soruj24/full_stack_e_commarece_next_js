"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, Search, ChevronDown, ChevronUp, Loader2, MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  views: number;
}

interface FaqCategory {
  category: string;
  slug: string;
  icon: string;
  description: string;
  faqs: FaqItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Getting Started": <span className="text-2xl">🚀</span>,
  "Orders & Shipping": <span className="text-2xl">📦</span>,
  "Payments": <span className="text-2xl">💳</span>,
  "Returns": <span className="text-2xl">↩️</span>,
  "Account": <span className="text-2xl">👤</span>,
  "Products": <span className="text-2xl">🛍️</span>,
  "General": <HelpCircle className="w-5 h-5" />,
};

const categoryGradients: Record<string, string> = {
  "Getting Started": "from-blue-500 to-cyan-500",
  "Orders & Shipping": "from-purple-500 to-pink-500",
  "Payments": "from-green-500 to-emerald-500",
  "Returns": "from-orange-500 to-red-500",
  "Account": "from-indigo-500 to-violet-500",
  "Products": "from-pink-500 to-rose-500",
  "General": "from-primary to-purple-500",
};

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
        setExpandedCategories(data.data.map((c: FaqCategory) => c.category));
      }
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = searchQuery
    ? faqs.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : faqs;

  const totalQuestions = faqs.reduce((acc, cat) => acc + cat.faqs.length, 0);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Find quick answers to common questions about our products, shipping, returns, and more.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 rounded-2xl bg-card border-border/50 text-lg shadow-lg"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground font-medium">
                <span className="font-bold text-foreground">{totalQuestions}</span> questions across <span className="font-bold text-foreground">{faqs.length}</span> categories
              </p>
            </div>

            <div className="space-y-6">
              {filteredFaqs.map((category, catIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <Card className="overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                    <button
                      onClick={() =>
                        setExpandedCategories((prev) =>
                          prev.includes(category.category)
                            ? prev.filter((c) => c !== category.category)
                            : [...prev, category.category]
                        )
                      }
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${categoryGradients[category.category] || categoryGradients["General"]} flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl">
                            {categoryIcons[category.category] || categoryIcons["General"]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{category.category}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.faqs.length} questions
                          </p>
                        </div>
                      </div>
                      {expandedCategories.includes(category.category) ? (
                        <ChevronUp className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>

                    {expandedCategories.includes(category.category) && (
                      <div className="border-t">
                        {category.faqs.map((faq, faqIndex) => (
                          <motion.div
                            key={faq._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: faqIndex * 0.05 }}
                            className="border-b last:border-b-0"
                          >
                            <button
                              onClick={() => toggleItem(faq._id)}
                              className="w-full p-6 flex items-start justify-between text-left hover:bg-muted/20 transition-colors"
                            >
                              <div className="flex-1 pr-4">
                                <h4 className="font-semibold text-left">{faq.question}</h4>
                              </div>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedItems.includes(faq._id) ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted'}`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </button>
                            {expandedItems.includes(faq._id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6"
                              >
                                <div 
                                  className="text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4"
                                  dangerouslySetInnerHTML={{ __html: faq.answer }} 
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <Card className="text-center py-16 shadow-lg">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <HelpCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No results found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn&apos;t find any questions matching your search. Try different keywords or browse all categories.
                  </p>
                  <Button onClick={() => setSearchQuery("")} className="rounded-xl">
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary to-purple-500 rounded-[32px] p-10 text-white text-center shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
          <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto">
            Our friendly support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-xl h-12 font-bold" asChild>
              <Link href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl h-12 font-bold border-white text-white hover:bg-white hover:text-primary" asChild>
              <a href="tel:+15551234567">
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
