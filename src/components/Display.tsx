import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {Car} from "@/lib/types";

interface Blog7Props {
    tagline: string;
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    posts: Car[]
}

export default function DisplayProductComponent({
                                                    tagline = "Latest Updates",
                                                    heading = "Blog Posts",
                                                    description = "Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.",
                                                    buttonText = "View all articles",
                                                    buttonUrl = "",
                                                    posts
                                                }: Blog7Props){
    return (
        <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
                <div className="text-center">
                    <Badge 
                        variant="secondary" 
                        className="mb-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg"
                    >
                        {tagline}
                    </Badge>
                    <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                        {heading}
                    </h2>
                    <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                        {description}
                    </p>
                    <Button 
                        variant="link" 
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3 rounded-full no-underline hover:no-underline" 
                        asChild
                    >
                        <a href={buttonUrl} target="_blank">
                            {buttonText}
                            <ArrowRight className="ml-2 size-4" />
                        </a>
                    </Button>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                    {posts.map((post) => (
                        <Card
                            key={post.id}
                            className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="aspect-16/9 w-full relative overflow-hidden rounded-t-2xl">
                                <a
                                    href={post.make}
                                    target="_blank"
                                    className="block h-full w-full"
                                >
                                    <Image
                                        src={post.image}
                                        width={500}
                                        height={500}
                                        alt={post.make}
                                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay - Hidden by default, appears on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </a>
                            </div>

                            {/* Content Overlay - Slides up from bottom on hover */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <div className="text-white space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                    <h3 className="text-xl font-bold leading-tight">
                                        {post.make}
                                    </h3>
                                    <p className="text-gray-200 text-sm line-clamp-3">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center text-white/90 hover:text-white transition-colors duration-300">
                                        <span className="text-sm font-medium">Read more</span>
                                        <ArrowRight className="ml-2 size-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Clean Card View - Visible by default, fades on hover */}
                            <div className="group-hover:opacity-0 transition-opacity duration-500">
                                <CardHeader className="pb-3">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                                        {post.make}
                                    </h3>
                                </CardHeader>
                                <CardContent className="pt-0 pb-4">
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {post.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <span>View Details</span>
                                        <ArrowRight className="ml-2 size-3" />
                                    </div>
                                </CardFooter>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-xl"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};