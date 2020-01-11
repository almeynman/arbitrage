(ns asset
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [string :as string]))

(def code-regex #"^[A-Z]{3,5}$")
(defn valid-code? [e] (re-matches code-regex e))
(def gen-code
  (gen/fmap
    (fn [v] (->> (clojure.string/join v)
                 (clojure.string/upper-case)))
    (gen/vector gen/char-alpha 3 5)))
(s/def ::code
  (s/with-gen
    (s/and string? valid-code?)
    (fn [] gen-code)))

(s/def ::name ::string/non-blank)

(s/def ::decimal-places (s/int-in 0 30))

(s/def ::asset
  (s/keys :req-un [::code ::decimal-places]
          :opt-un [::name]))

(s/def ::base ::asset)
(s/def ::quote ::asset)
(s/def ::pair (s/keys :req-un [::base ::quote]))

(def symbol-regex #"^[A-Z]{3,5}/[A-Z]{3,5}$")
(defn valid-symbol? [s] (re-matches symbol-regex s))
(def gen-symbol
  (gen/fmap
    (fn [[c1 c2]] (str c1 "/" c2))
    (gen/tuple gen-code gen-code)))
(s/def ::symbol (s/with-gen (s/and string? valid-symbol?) (fn [] gen-symbol)))

(defn pair->symbol [{base :base quote :quote}]
  (let [{base-code :code} base
        {quote-code :code} quote]
    (->> (str base-code "/" quote-code)
         (clojure.string/upper-case))))
(s/fdef pair->symbol
        :args (s/cat :pair ::pair)
        :ret ::symbol)

(comment
  (def test-pair (gen/generate (s/gen ::pair)))
  (s/exercise-fn pair->symbol)

  (def base (gen/generate (s/gen ::asset)))
  (def quote (gen/generate (s/gen ::asset)))
  (let [{base-code :code} base
        {quote-code :code} quote]
    (->> (str base-code "/" quote-code)
         (clojure.string/upper-case)))
  ())
