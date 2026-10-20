import "./AnimatedCrocodile.css";

type AnimatedCrocodileProps = {
  className?: string;
};

export default function AnimatedCrocodile({
  className = "",
}: AnimatedCrocodileProps) {
  return (
    <div
      className={`pn-crocodile ${className}`}
      role="img"
      aria-label="Animated PUNUTIE Health Teacher medical crocodile"
    >
      <svg
        className="pn-crocodile__svg"
        viewBox="0 0 360 230"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pn-croc-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#69cf65" />
            <stop offset="100%" stopColor="#007844" />
          </linearGradient>

          <linearGradient id="pn-croc-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff6b8" />
            <stop offset="100%" stopColor="#e5bd43" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse
          cx="178"
          cy="196"
          rx="112"
          ry="12"
          fill="#006b42"
          opacity=".12"
          className="pn-crocodile__shadow"
        />

        {/* Tail: moves independently */}
        <g className="pn-crocodile__tail">
          <path
            d="M108 135 C75 123 55 137 37 155 C25 167 16 171 8 166 C25 191 49 184 66 170 C85 155 100 157 116 157Z"
            fill="url(#pn-croc-green)"
            stroke="#075b36"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M39 157 L49 164 L60 155 M56 146 L67 153 L78 145"
            fill="none"
            stroke="#a3e68b"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Back legs */}
        <g className="pn-crocodile__back-leg">
          <path
            d="M103 153 Q88 168 96 183 L119 186 L132 169Z"
            fill="#159650"
            stroke="#075b36"
            strokeWidth="3"
          />
          <path
            d="M99 181 L91 190 L108 190 L117 185"
            fill="#ffdc65"
            stroke="#075b36"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* Body */}
        <path
          d="M92 113 Q112 78 160 87 L220 96 Q253 102 263 133 L246 166 Q207 185 144 166 Q108 160 92 143Z"
          fill="url(#pn-croc-green)"
          stroke="#075b36"
          strokeWidth="3"
        />

        {/* Belly */}
        <path
          d="M116 144 Q161 163 205 148 Q228 141 245 151 L234 166 Q188 184 144 166Z"
          fill="url(#pn-croc-belly)"
          stroke="#a87918"
          strokeWidth="1.5"
        />

        {/* Belly details */}
        <path
          d="M145 158 L148 171 M166 162 L168 175 M188 162 L189 174 M210 158 L211 168"
          fill="none"
          stroke="#c49c36"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Front legs */}
        <g className="pn-crocodile__front-leg">
          <path
            d="M210 153 Q226 161 222 180 L243 187 L258 176 L245 155Z"
            fill="#159650"
            stroke="#075b36"
            strokeWidth="3"
          />
          <path
            d="M239 183 L235 191 L254 191 L263 182"
            fill="#ffdc65"
            stroke="#075b36"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* Neck and head */}
        <path
          d="M190 102 Q209 73 237 76 L282 91 Q300 99 310 114 L283 140 L231 139 Q207 134 190 119Z"
          fill="url(#pn-croc-green)"
          stroke="#075b36"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Upper snout */}
        <path
          d="M245 91 Q277 79 314 94 Q336 99 345 112 L337 127 L282 128 Q262 121 245 111Z"
          fill="#36ae53"
          stroke="#075b36"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Snout nostrils */}
        <ellipse cx="315" cy="103" rx="3.5" ry="2.5" fill="#075b36" />
        <ellipse cx="328" cy="107" rx="3.5" ry="2.5" fill="#075b36" />

        {/* Jaw: hinged movement */}
        <g className="pn-crocodile__jaw">
          <path
            d="M267 121 Q302 126 337 120 L347 130 Q326 151 291 145 L268 134Z"
            fill="#e4c75b"
            stroke="#075b36"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Teeth */}
          <path
            d="M283 126 L289 136 L294 127 L300 137 L306 126 L312 135 L318 125 L324 132 L331 123"
            fill="#fffdf0"
            stroke="#075b36"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Eye surrounds */}
        <ellipse
          cx="262"
          cy="87"
          rx="17"
          ry="18"
          fill="#ffdf55"
          stroke="#075b36"
          strokeWidth="3"
        />

        {/* Blinking eye */}
        <g className="pn-crocodile__eye">
          <ellipse cx="265" cy="87" rx="7" ry="9" fill="#fff" />
          <ellipse cx="268" cy="87" rx="3.5" ry="6" fill="#173b2a" />
          <circle cx="269" cy="84" r="1.7" fill="#fff" />
        </g>

        {/* Eyebrow */}
        <path
          d="M247 75 Q261 65 276 77"
          fill="none"
          stroke="#075b36"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* PT badge */}
        <g className="pn-crocodile__badge">
          <circle
            cx="167"
            cy="119"
            r="23"
            fill="#fffdf0"
            stroke="#e5bd43"
            strokeWidth="4"
          />
          <text
            x="167"
            y="125"
            textAnchor="middle"
            fontSize="17"
            fontWeight="900"
            fill="#007844"
          >
            PT
          </text>
        </g>

        {/* Medical heart */}
        <g className="pn-crocodile__heart">
          <path
            d="M126 93 C119 84 105 90 109 101 C112 108 126 117 126 117 C126 117 140 107 143 100 C147 88 133 84 126 93Z"
            fill="#ff5265"
            stroke="#fff"
            strokeWidth="2"
          />
          <path
            d="M111 101 H119 L123 94 L128 106 L133 99 H140"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Stethoscope */}
        <g className="pn-crocodile__stethoscope">
          <path
            d="M183 105 V123 Q183 137 196 137 Q208 137 208 123 V116"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="208" cy="112" r="7" fill="#ff5265" stroke="#fff" strokeWidth="2" />
          <circle cx="208" cy="112" r="2.5" fill="#fff" />
        </g>

        {/* Animated heartbeat */}
        <g className="pn-crocodile__pulse">
          <path
            d="M115 49 H140 L150 34 L162 61 L174 40 L184 49 H211"
            fill="none"
            stroke="#ff5265"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Decorative sparkles */}
        <g className="pn-crocodile__sparkles" fill="#e6bc39">
          <path d="M80 72 L84 82 L94 86 L84 90 L80 100 L76 90 L66 86 L76 82Z" />
          <path d="M303 55 L306 62 L313 65 L306 68 L303 75 L300 68 L293 65 L300 62Z" />
        </g>
      </svg>
    </div>
  );
}
