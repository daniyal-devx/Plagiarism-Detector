# Mathematical Concepts & Algorithms

## Table of Contents
1. [Set Theory Foundations](#set-theory-foundations)
2. [Hashing Functions](#hashing-functions)
3. [Similarity Metrics](#similarity-metrics)
4. [K-Gram Generation](#k-gram-generation)
5. [Winnowing Algorithm](#winnowing-algorithm)
6. [Algorithm Analysis](#algorithm-analysis)

---

## Set Theory Foundations

### Basic Definitions

**Set**: A collection of distinct elements
```
A = {a₁, a₂, a₃, ..., aₙ}
```

**Empty Set**: ∅ or {}

**Cardinality**: Number of elements in a set
```
|A| = n
```

### Set Operations

#### 1. Union (∪)
Combines all elements from both sets, no duplicates.

```
A ∪ B = {x | x ∈ A OR x ∈ B}
```

**Example:**
```
A = {1, 2, 3}
B = {3, 4, 5}
A ∪ B = {1, 2, 3, 4, 5}
|A ∪ B| = 5
```

**Implementation:**
```typescript
function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const result = new Set<T>(setA);
  for (const item of setB) {
    result.add(item);
  }
  return result;
}
```

#### 2. Intersection (∩)
Elements present in both sets.

```
A ∩ B = {x | x ∈ A AND x ∈ B}
```

**Example:**
```
A = {1, 2, 3}
B = {3, 4, 5}
A ∩ B = {3}
|A ∩ B| = 1
```

**Implementation:**
```typescript
function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const result = new Set<T>();
  const [smaller, larger] = setA.size < setB.size 
    ? [setA, setB] 
    : [setB, setA];
  
  for (const item of smaller) {
    if (larger.has(item)) {
      result.add(item);
    }
  }
  return result;
}
```

**Time Complexity:** O(min(|A|, |B|))

#### 3. Difference (\)
Elements in first set but not in second.

```
A \ B = {x | x ∈ A AND x ∉ B}
```

**Example:**
```
A = {1, 2, 3}
B = {3, 4, 5}
A \ B = {1, 2}
```

### Application to Plagiarism Detection

**Document Representation:**
```
Document D → Set of Fingerprints F(D)
F(D) = {f₁, f₂, f₃, ..., fₙ}
```

**Comparison:**
```
Given two documents D₁ and D₂:
F₁ = F(D₁) = {fingerprints from D₁}
F₂ = F(D₂) = {fingerprints from D₂}

Common content: F₁ ∩ F₂
All content: F₁ ∪ F₂
Unique to D₁: F₁ \ F₂
```

---

## Hashing Functions

### Purpose
Convert variable-length strings to fixed-size integers.

```
h: String → Integer
h(s) = hash value
```

### Properties of Good Hash Functions

1. **Deterministic**: Same input → same output
2. **Uniform Distribution**: Outputs evenly distributed
3. **Fast Computation**: O(n) where n = input length
4. **Avalanche Effect**: Small input change → large output change
5. **Collision Resistance**: Hard to find h(x) = h(y) where x ≠ y

### Polynomial Rolling Hash

**Formula:**
```
h(s) = (s[0]×p⁰ + s[1]×p¹ + s[2]×p² + ... + s[n-1]×pⁿ⁻¹) mod m
```

Where:
- `s[i]` = character code at position i
- `p` = prime base (typically 31 or 53)
- `m` = large prime modulo (e.g., 10⁹ + 9)

**Example:**
```
Text: "abc"
p = 31, m = 10⁹ + 9

h("abc") = (97×31⁰ + 98×31¹ + 99×31²) mod (10⁹ + 9)
         = (97 + 3038 + 95151) mod (10⁹ + 9)
         = 98286
```

**Implementation:**
```typescript
function polynomialHash(str: string): number {
  const prime = 31;
  const mod = 1e9 + 9;
  let hash = 0;
  let power = 1;
  
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * power) % mod;
    power = (power * prime) % mod;
  }
  
  return hash;
}
```

**Time Complexity:** O(n) where n = string length

### FNV-1a Hash

More efficient for short strings.

**Algorithm:**
```
hash = FNV_offset_basis
for each byte in input:
    hash = hash XOR byte
    hash = hash × FNV_prime
return hash
```

**Constants:**
- FNV_offset_basis = 2166136261 (32-bit)
- FNV_prime = 16777619

**Implementation:**
```typescript
function fnvHash(str: string): number {
  const FNV_PRIME = 0x01000193;
  const FNV_OFFSET = 0x811c9dc5;
  
  let hash = FNV_OFFSET;
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  
  return hash >>> 0; // Unsigned 32-bit
}
```

**Time Complexity:** O(n)

### Collision Analysis

**Birthday Paradox:**
- With m possible hash values
- After √m hashes, 50% chance of collision

**For m = 2³²:**
- √(2³²) = 2¹⁶ = 65,536
- Expected collision after ~65K documents

**Mitigation:**
- Use larger hash space (64-bit)
- Use multiple hash functions
- Accept small collision rate

---

## Similarity Metrics

### 1. Jaccard Similarity

**Definition:**
```
J(A, B) = |A ∩ B| / |A ∪ B|
```

**Properties:**
- Range: [0, 1]
- J(A, A) = 1 (identical)
- J(A, ∅) = 0 (no overlap)
- J(A, B) = J(B, A) (symmetric)

**Interpretation:**
- 0.9-1.0: Very high similarity (likely plagiarism)
- 0.7-0.9: High similarity
- 0.5-0.7: Moderate similarity
- 0.0-0.5: Low similarity

**Example:**
```
Doc1 fingerprints: {1, 2, 3, 4, 5}
Doc2 fingerprints: {3, 4, 5, 6, 7}

Intersection: {3, 4, 5} → |A ∩ B| = 3
Union: {1, 2, 3, 4, 5, 6, 7} → |A ∪ B| = 7

J = 3/7 = 0.428 = 42.8%
```

**Advantages:**
- Simple to compute
- Intuitive interpretation
- Works well for documents of similar size

**Disadvantages:**
- Sensitive to document size differences
- Treats all fingerprints equally

### 2. Cosine Similarity

**Definition:**
```
cos(A, B) = |A ∩ B| / √(|A| × |B|)
```

**Example:**
```
Doc1 fingerprints: {1, 2, 3, 4, 5} → |A| = 5
Doc2 fingerprints: {3, 4, 5, 6, 7} → |B| = 5
Intersection: {3, 4, 5} → |A ∩ B| = 3

cos = 3 / √(5 × 5) = 3/5 = 0.6 = 60%
```

**Advantages:**
- Less sensitive to size differences
- Good for documents of different lengths

### 3. Overlap Coefficient

**Definition:**
```
O(A, B) = |A ∩ B| / min(|A|, |B|)
```

**Example:**
```
Doc1 fingerprints: {1, 2, 3} → |A| = 3
Doc2 fingerprints: {1, 2, 3, 4, 5, 6} → |B| = 6
Intersection: {1, 2, 3} → |A ∩ B| = 3

O = 3 / min(3, 6) = 3/3 = 1.0 = 100%
```

**Advantages:**
- Detects if smaller document is subset of larger
- Useful when document sizes vary greatly

**Use Case:**
- Detecting if short text is copied from longer document

### 4. Dice Coefficient

**Definition:**
```
D(A, B) = 2|A ∩ B| / (|A| + |B|)
```

**Example:**
```
Doc1 fingerprints: {1, 2, 3, 4, 5} → |A| = 5
Doc2 fingerprints: {3, 4, 5, 6, 7} → |B| = 5
Intersection: {3, 4, 5} → |A ∩ B| = 3

D = (2 × 3) / (5 + 5) = 6/10 = 0.6 = 60%
```

**Comparison:**
```
Same data:
- Jaccard: 42.8%
- Cosine: 60%
- Dice: 60%
- Overlap: 60%
```

---

## K-Gram Generation

### Definition

**K-gram**: Substring of length k extracted using sliding window.

**Formula:**
```
For text of length n:
Number of k-grams = n - k + 1
```

### Algorithm

```
Input: text = "hello", k = 3
Process:
  Position 0: "hel"
  Position 1: "ell"
  Position 2: "llo"
Output: ["hel", "ell", "llo"]
```

### Implementation

```typescript
function generateKGrams(text: string, k: number): string[] {
  const kgrams: string[] = [];
  
  for (let i = 0; i <= text.length - k; i++) {
    kgrams.push(text.substring(i, i + k));
  }
  
  return kgrams;
}
```

**Time Complexity:** O(n) where n = text length

### Choosing K Value

**Small K (k=3,4):**
- More k-grams generated
- Detects shorter matches
- Higher collision rate
- More sensitive to changes

**Large K (k=8,9,10):**
- Fewer k-grams
- Detects longer matches
- Lower collision rate
- Less sensitive to minor changes

**Recommended:**
- General use: k=5
- Short documents: k=3-4
- Long documents: k=6-8

### Word N-Grams

Alternative to character k-grams.

```
Text: "the quick brown fox"
3-grams:
  "the quick brown"
  "quick brown fox"
```

**Advantages:**
- More semantic meaning
- Less sensitive to character changes
- Better for natural language

**Disadvantages:**
- Fewer n-grams generated
- May miss character-level modifications

---

## Winnowing Algorithm

### Motivation

Standard k-gram hashing:
- Generates many fingerprints
- Sensitive to insertions/deletions
- High storage cost

Winnowing:
- Selects representative fingerprints
- More robust to changes
- Reduces storage

### Algorithm

**Steps:**

1. Generate k-grams
2. Hash all k-grams
3. Apply sliding window of size w
4. Select minimum hash in each window

**Guarantee:**
If two documents share substring of length > (w + k - 1), they will share at least one fingerprint.

### Example

```
Text: "adorunrun"
k = 4, w = 3

K-grams: ["ador", "doru", "orun", "runr", "unru", "nrun"]
Hashes:  [15,   1,     17,   19,   8,     11]

Windows:
[15, 1, 17] → min = 1 ✓
[1, 17, 19] → min = 1 (already selected)
[17, 19, 8] → min = 8 ✓
[19, 8, 11] → min = 8 (already selected)

Selected: {1, 8}
```

### Implementation

```typescript
function winnowing(kgrams: string[], windowSize: number): Set<number> {
  const hashes = kgrams.map(kg => hash(kg));
  const selected = new Set<number>();
  
  for (let i = 0; i <= hashes.length - windowSize; i++) {
    const window = hashes.slice(i, i + windowSize);
    const minHash = Math.min(...window);
    selected.add(minHash);
  }
  
  return selected;
}
```

**Time Complexity:** O(n × w) where n = number of k-grams

**Space Reduction:**
```
Without winnowing: n fingerprints
With winnowing: ~n/w fingerprints
Reduction: ~w times fewer
```

---

## Algorithm Analysis

### Space Complexity

**Per Document:**
```
Text size: n bytes
K-grams: (n - k + 1) ≈ n
Fingerprints: n × 4 bytes = 4n bytes
With winnowing: 4n/w bytes
```

**Example:**
```
1 KB document (1024 bytes)
k = 5, w = 4

Without winnowing: ~4 KB fingerprints
With winnowing: ~1 KB fingerprints
```

### Time Complexity

**Single Document Processing:**
```
Preprocessing: O(n)
K-gram generation: O(n)
Hashing: O(n)
Set creation: O(n)
Total: O(n)
```

**Document Comparison:**
```
Intersection: O(min(|A|, |B|))
Union: O(|A| + |B|)
Jaccard: O(min(|A|, |B|))
```

**All Pairwise Comparisons:**
```
For m documents:
Comparisons: m(m-1)/2 = O(m²)
Per comparison: O(n)
Total: O(m²n)
```

### Scalability

**For 10 documents (1KB each):**
```
Fingerprints per doc: ~1000
Comparisons: 45
Time: ~45ms
```

**For 100 documents:**
```
Comparisons: 4,950
Time: ~5 seconds
```

**For 1000 documents:**
```
Comparisons: 499,500
Time: ~8 minutes
```

### Optimization Strategies

1. **Parallel Processing**
   - Compare documents in parallel
   - Speed up: ~N times (N = cores)

2. **LSH (Locality-Sensitive Hashing)**
   - Approximate similarity
   - Speed up: 100-1000x
   - Trade-off: Some accuracy loss

3. **Caching**
   - Cache fingerprints
   - Avoid recomputation

4. **Pruning**
   - Skip comparisons below threshold
   - Early termination

---

## Conclusion

This plagiarism detector demonstrates:

1. **Set Theory**: Foundation for representing and comparing documents
2. **Hashing**: Efficient transformation of text to fingerprints
3. **Similarity Metrics**: Multiple ways to quantify document similarity
4. **Algorithm Design**: Trade-offs between accuracy, speed, and storage
5. **Practical Application**: Real-world use of discrete mathematics

The algorithms are production-ready and can scale to thousands of documents with appropriate optimizations.
