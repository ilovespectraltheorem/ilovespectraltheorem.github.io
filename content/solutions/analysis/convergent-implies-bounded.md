+++
title = 'Convergent sequences are bounded'
date = 2026-11-04
draft = false
source = 'Example exercise'
tags = ['sequences']
+++
**Problem.** Show that if $a_n \to a$ in $\mathbb{R}$, then $(a_n)$ is bounded.

{{< solution >}}
**Proof.** Take $\varepsilon = 1$: there is $N$ with $|a_n - a| < 1$ for all $n \ge N$, so $|a_n| < |a| + 1$ for $n \ge N$. Let
$$
M = \max\{|a_1|, \dots, |a_{N-1}|, |a| + 1\}.
$$
Then $|a_n| \le M$ for every $n$. $\blacksquare$
{{< /solution >}}
