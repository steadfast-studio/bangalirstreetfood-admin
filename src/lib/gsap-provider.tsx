"use client";
import gsap from "gsap";
import { MorphSVGPlugin, MotionPathPlugin, ScrollTrigger } from "gsap/all";
//list as many as you'd like
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, MorphSVGPlugin);
const GsapProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default GsapProvider;
